from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
import pandas as pd
import os
import joblib
from sklearn.cluster import KMeans
from pyod.models.iforest import IForest


def extract_data():
    current_file_path = os.path.abspath(__file__)
    csv_file_path = os.path.join(os.path.dirname(current_file_path), 'merged_transaction_data.csv')
    banned_csv_file_path = os.path.join(os.path.dirname(current_file_path), 'banned_districts.csv')
    
    banned_districts_df = pd.read_csv(banned_csv_file_path)
    banned_district_ids = banned_districts_df['district_id'].tolist()
    
    df = pd.read_csv(csv_file_path)
    df_filtered_transactions = df[~df['district_id'].isin(banned_district_ids)].copy()
    return df_filtered_transactions


def transform_data(df):
    df = df[['trans_date', 'account_id', 'trans_type', 'amount']].copy()
    df['trans_date'] = pd.to_datetime(df['trans_date'])
    
    rename = {'C': 'CREDIT', 'D': 'WITHDRAWAL', 'P': 'NOT SURE'}
    df['trans_type'] = df['trans_type'].replace(rename)
    
    df_withdrawals = df.query('trans_type == "WITHDRAWAL"').sort_values(by=['account_id', 'trans_date']).set_index('trans_date').copy()
    df_withdrawals['amount'] = df_withdrawals['amount'].abs() * 10
    
    df_withdrawals['total_withdrawals_5d'] = df_withdrawals.groupby('account_id')['amount'].transform(lambda s: s.rolling('5D').sum())
    df_withdrawals['num_withdrawals_5d'] = df_withdrawals.groupby('account_id')['amount'].transform(lambda s: s.rolling('5D').count())
    
    account_data = df_withdrawals.groupby('account_id').agg({
        'num_withdrawals_5d': 'sum',
        'total_withdrawals_5d': 'sum'
    }).reset_index()
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(account_data[['num_withdrawals_5d', 'total_withdrawals_5d']])
    
    return account_data, df_withdrawals, X_scaled


def clustering(account_data, df_withdrawals, X_scaled, num_clusters=10):
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init='auto')
    account_data['cluster'] = kmeans.fit_predict(X_scaled)
    
    cluster_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'cluster_data')
    os.makedirs(cluster_dir, exist_ok=True)
    
    for cluster_id in range(num_clusters):
        cluster_accounts = account_data[account_data['cluster'] == cluster_id]['account_id']
        cluster_transactions = df_withdrawals[df_withdrawals['account_id'].isin(cluster_accounts)]
        cluster_filename = os.path.join(cluster_dir, f'cluster_{cluster_id}_withdrawals.csv')
        cluster_transactions.to_csv(cluster_filename, index=True)


def isolation_forest():
    cluster_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'cluster_data')
    result_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'results')
    model_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'models')
    os.makedirs(result_dir, exist_ok=True)
    os.makedirs(model_dir, exist_ok=True)
    
    for filename in os.listdir(cluster_dir):
        if filename.endswith('.csv'):
            cluster_data = pd.read_csv(os.path.join(cluster_dir, filename))
            if 'num_withdrawals_5d' not in cluster_data.columns or 'total_withdrawals_5d' not in cluster_data.columns:
                continue
            
            X = cluster_data[['num_withdrawals_5d', 'total_withdrawals_5d']]
            clf = IForest(contamination=0.001)
            clf.fit(X)
            
            cluster_data['anomaly_label'] = clf.labels_
            result_filename = os.path.join(result_dir, f'anomaly_detection_{filename}')
            cluster_data.to_csv(result_filename, index=False)
            
            cluster_number = filename.split('_')[1]
            model_filename = os.path.join(model_dir, f'iforest_model_{cluster_number}.joblib')
            joblib.dump(clf, model_filename)


def test_withdrawals_test():
    test_csv_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'test_withdrawals.csv')
    if not os.path.exists(test_csv_path):
        print(f"Error: Test file '{test_csv_path}' not found.")
        return
    
    df_test = pd.read_csv(test_csv_path).head(50)
    model_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'models')
    results = []
    
    for index, row in df_test.iterrows():
        test_data_point = pd.DataFrame({
            'num_withdrawals_5d': [row['num_withdrawals_5d']],
            'total_withdrawals_5d': [row['total_withdrawals_5d']]
        })
        
        cluster_id = None
        for filename in os.listdir(model_dir):
            if filename.endswith('.joblib'):
                try:
                    cluster_id = int(filename.split('_')[2].replace('.joblib', ''))
                    break
                except ValueError:
                    continue
        
        if cluster_id is None:
            print(f"Error: No valid model found for account ID {row['account_id']}")
            continue
        
        model_path = os.path.join(model_dir, f'iforest_model_{cluster_id}.joblib')
        if not os.path.exists(model_path):
            print(f"Error: Model file '{model_path}' not found.")
            continue
        
        model = joblib.load(model_path)
        y_pred = model.predict(test_data_point)
        results.append({'account_id': row['account_id'], 'anomaly_label': int(y_pred[0])})
    
    df_results = pd.DataFrame(results)
    results_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'results', 'withdrawals_test_results.csv')
    df_results.to_csv(results_path, index=False)
    print(f"Results saved to: {results_path}")


if __name__ == "__main__":
    df = extract_data()
    account_data, df_withdrawals, X_scaled = transform_data(df)
    clustering(account_data, df_withdrawals, X_scaled)
    isolation_forest()
    test_withdrawals_test()