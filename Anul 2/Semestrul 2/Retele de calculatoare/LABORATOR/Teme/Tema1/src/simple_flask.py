from flask import Flask, jsonify
from flask import request
import socket
import math

app = Flask(__name__)

@app.route('/')
def hello():
    return "Chiritoiu Andra - 193/2024"

'''
This method expects a json content.
Use header: 'Content-Type: application/json'
'''
@app.route('/post', methods=['POST'])
def post_method():
    print("Got from user: ", request.get_json())
    print(request.get_json()['value']*2)
    return jsonify({'got_it': 'yes'})


@app.route('/item/<item_id>')
def get_item(item_id):
    return jsonify({"item_id": item_id})


@app.route('/ip')
def get_ip():
    ip=socket.gethostbyname(socket.gethostname())
    return jsonify({"ip": ip})

@app.route('/subnet', methods=['POST'])
def subnet():
    date=request.get_json()
    noduri=int(date['noduri'])

    #1
    biti_host=math.ceil(math.log2(noduri + 2))

    #2
    prefix=32-biti_host

    #3
    masca=(0XFFFFFFFF << biti_host) & 0XFFFFFFFF
    rez=[]

    for i in [24,16,8,0]:
        rez.append(str((masca>>i) & 255))

    masca_rez=".".join(rez)

    return jsonify({
        "masca": masca_rez,
        "prefix": "/" + str(prefix)
    })

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)