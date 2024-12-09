import requests
url = "http://ec2-35-170-53-99.compute-1.amazonaws.com:3000/departments/"
response = requests.get(url)
data = response.json()

x = [i for i in range(1,96)]
not_x = []
for department in data:
    # print(department['code'])
    # if code in x remove x from x
    if department['code'] in x:
        x.remove(department['code'])
    else:
        not_x.append(department['code'])
    
print(x)
print(not_x) 