from flask import abort, json, request
import requests
import datetime 
import statistics

# List of valid ISO3 codes, as per the assignment instructions
valid_ISO3 = ['COL', 'BFA']

def metric_b_controller(ISO3, date_start, date_end):
    data = []
    if ISO3.find(',') != -1:
        ISO3 = ISO3.split(',')
        
        for ISO in ISO3:
            ISO = ISO.strip()
            if ISO not in valid_ISO3:
                abort(400)
            data += daily_national_estimate_prevalence(ISO, date_start, date_end)
        return data
    
    if ISO3 not in valid_ISO3:
        abort(400)
    return daily_national_estimate_prevalence(ISO3, date_start, date_end)

def metric_a_controller(ISO3, date_start, date_end):
    data = []
    if ISO3.find(',') != -1:
        ISO3 = ISO3.split(',')
        
        for ISO in ISO3:
            ISO = ISO.strip()
            if ISO not in valid_ISO3:
                abort(400)
            data.append({ 'ISO3': ISO, 'data': avg_monthly_value_region(ISO, date_start, date_end) })
        return data
    
    if ISO3 not in valid_ISO3:
        abort(400)
    return data.append({ 'ISO3': ISO3, 'data': avg_monthly_value_region(ISO3, date_start, date_end) })


def fetch_country_data(ISO3, date_start, date_end):
        useLocal = request.args.get('useLocal', default = False, type = lambda a: a.lower() == 'true')
        if ISO3 not in valid_ISO3:
            abort(400)
        if useLocal == True:
            return fetch_country_data_local(ISO3)
        
        data = requests.get(f'https://api.hungermapdata.org/v1/foodsecurity/country/{ISO3}/region?date_start={date_start}&date_end={date_end}')
        return data.json()

def fetch_country_data_local(ISO3):
        if ISO3 not in valid_ISO3:
            abort(400)
        
        filepath = f'./data/{ISO3}.json'
        data = json.load(open(filepath, "r"))
        return data

def avg_monthly_value_region(ISO3, date_start, date_end):
    daily_data = [{"date": datetime.datetime.strptime(obj['date'], '%Y-%m-%d').date(), "country": obj['country'], "region_id": int(obj['region']['id']), 'region': obj['region'], "metrics": obj['metrics']} for obj in fetch_country_data(ISO3, date_start, date_end)]
    #[{date, country, region, metrics}]

    relevant_metrics = ['fcs']

    regional_data = {}
    for obj in daily_data:
        key = (obj['date'].year, obj['date'].month, obj['region_id'])
        if key not in regional_data:
            regional_data[key] = {
                'metrics': {
                    metric: {
                        attr: [] for attr in obj['metrics'][metric]
                    } for metric in relevant_metrics
                },
                'region': obj['region'],
                'country': obj['country']
            }
        for metric in relevant_metrics:
            for attr in obj['metrics'][metric]:
                regional_data[key]['metrics'][metric][attr].append(obj['metrics'][metric][attr])

    monthly_averages = []
    for key, value in regional_data.items():
        monthly_averages.append({
            'date': datetime.date(key[0], key[1], 1)
            , 'region': value['region']
            , 'country': value['country']
            , 'metrics': {
                    metric: {
                        attr: sum(value['metrics'][metric][attr])
                        / len(value['metrics'][metric][attr]) 
                        for attr in value['metrics'][metric] 
                        if len(value['metrics'][metric][attr]) > 0
                    } for metric in value['metrics']
                }
            })

    
    return monthly_averages


def daily_national_estimate_prevalence(ISO3, date_start, date_end):
    
    data = [{"date": datetime.datetime.strptime(obj['date'], '%Y-%m-%d').date(), 'country': obj['country'], "region": obj['region'], "metrics": obj['metrics']} for obj in fetch_country_data(ISO3, date_start, date_end)]

    # Create a dictionary to store the FCS scores by date
    fcs_scores = {}
    for obj in data:
        date = obj["date"].strftime("%Y-%m-%d")
        if date not in fcs_scores:
            fcs_scores[date] = {"prevalence": []}
        fcs_scores[date]['country'] = obj['country']


    # Aggregate the FCS scores by date
    for obj in data:
        date = obj["date"].strftime("%Y-%m-%d")
        if 'prevalence' in obj["metrics"]["fcs"]:
            fcs_scores[date]["prevalence"].append(obj["metrics"]["fcs"]["prevalence"])

    # Calculate the average FCS score by date
    daily_estimate = []
    for date, value in fcs_scores.items():
        if 'prevalence' in value:
            mean = statistics.mean(value['prevalence'])
            daily_estimate.append({
                'date': date
                , 'country': value['country']
                , 'mean': mean
                , 'variance': sum((prev - mean) ** 2 for prev in value['prevalence']) / (len(value['prevalence']) - 1)
                , 'prevalence': sum(value['prevalence']) / len(value['prevalence'])
            })
        
    return daily_estimate