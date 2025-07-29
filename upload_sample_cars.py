import json
import requests

API_URL = 'http://localhost:8000/api/cars/'

with open('sample_cars.json', 'r') as f:
    cars = json.load(f)

for idx, car in enumerate(cars, 1):
    try:
        resp = requests.post(API_URL, json=car)
        if resp.status_code == 201:
            print(f"[{idx}] Uploaded: {car['company_name']} {car['model']} ({car['year']})")
        else:
            print(f"[{idx}] Failed: {car['company_name']} {car['model']} ({car['year']}) - Status: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"[{idx}] Error uploading {car['company_name']} {car['model']} ({car['year']}): {e}") 