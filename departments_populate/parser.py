import json
import requests

json_file = open('departements-version-simplifiee.json')
json_data = json.load(json_file)
i = 0
for department in json_data['features']:
    if i == 1:
        break
    name = department['properties']['nom']
    code = department['properties']['code']
    feature_type = department['geometry']['type']
    polygons = department['geometry']['coordinates']

    
    

    #create a request with json body
    url = 'http://localhost:3000/departments'
    headers = {'Content-type': 'application/json'}
    data = {
        "name": name,
        "code": code,
        "perimeter": {
            "type": "Polygon",
            "coordinates": polygons
        }
    }
    # print(data)
    response = requests.post(url, headers=headers, json=data)
    i+=1
    print(response.json())
    for i in range(10):
        print(i)

