import json
import requests

json_file = open('departements-version-simplifiee.json')
json_data = json.load(json_file)

for department in json_data['features']:
    
    name = department['properties']['nom']
    code = department['properties']['code']
    feature_type = department['geometry']['type']
    polygons = department['geometry']['coordinates']

    
    

    #create a request with json body
    url = 'http://localhost:3001/departments'
    headers = {'Content-type': 'application/json'}
    data = {
        "name": name,
        "code": code,
        "perimeter": {
            "type": feature_type,
            "coordinates": polygons
        }
    }
    # print(data)
    response = requests.post(url, headers=headers, json=data)
    i+=1
    print(response.json())
    for j in range(10):
        print(i)

