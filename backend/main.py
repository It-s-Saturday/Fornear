from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from flask import Flask, request, jsonify

from fornear_secrets import ATLAS_PASS, ATLAS_USERNAME

uri = f"mongodb+srv://{ATLAS_USERNAME}:{ATLAS_PASS}@ganso.koavv7w.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi("1"))

app = Flask(__name__)
CLIENT = MongoClient(uri, server_api=ServerApi("1"))
DB = CLIENT["fornear"]

if __name__ == "__main__":
    app.run(debug=True)