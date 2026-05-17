import os
import urllib.request
import json

api_key = "AIzaSyCMrqUsL0yo69-cWjr4cV1brJhkSjF8QOI"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    for model in data.get('models', []):
        print(f"Name: {model['name']}, Supported: {model.get('supportedGenerationMethods', [])}")
