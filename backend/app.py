import json
import math
from datetime import datetime

from bson import ObjectId
from flask import Flask, jsonify, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from .fornear_secrets import ATLAS_PASS, ATLAS_USERNAME

uri = f"mongodb+srv://{ATLAS_USERNAME}:{ATLAS_PASS}@ganso.koavv7w.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi("1"))


def dump_json(data):
    return json.dumps(data, default=str)


app = Flask(__name__)
CLIENT = MongoClient(uri, server_api=ServerApi("1"))
DB = CLIENT["fornear-v1"]


# My own code
# https://github.com/It-s-Saturday/BillTracker/blob/c07f83c78f10259aed621f6c4d5ae9d526903898/backend/main.py#L25
def log_action(action, notes="", data={}):
    """ONLY USE IN INSERT, UPDATE, DELETE ACTIONS"""
    LOG_COLLECTION = DB["log"]
    LOG_COLLECTION.insert_one(
        {
            "action": action,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H:%M:%S"),
            "payload": data,
            "notes": notes,
        }
    )


@app.route("/api/get_inventory", methods=["GET"])
def get_inventory():
    inventory = list(DB["inventory"].find())
    return dump_json(inventory)


@app.route("/api/request_package", methods=["POST"])
def request_package():
    data = request.json
    data["fulfilled"] = 0
    data["request_date"] = datetime.now().strftime("%Y-%m-%d")
    data["request_time"] = datetime.now().strftime("%H:%M:%S")
    DB["requests"].insert_one(data)
    log_action("request_package", data=data)
    return jsonify({"message": "success"})


@app.route("/api/get_requests", methods=["GET"])
def get_requests():
    requests = list(
        DB["requests"].aggregate(
            [
                {"$match": {"fulfilled": 0}},
                {"$group": {"_id": "$packageId", "requests": {"$push": "$$ROOT"}}},
            ]
        )
    )
    for request in requests:
        package = DB["packages"].find_one({"_id": ObjectId(request["_id"])})
        request["packageName"] = package["packageName"]
    requests.sort(key=lambda x: x["packageName"])
    return dump_json(requests)


@app.route("/api/get_packages", methods=["GET"])
def get_packages():
    packages = list(DB["packages"].find())

    for package in packages:
        curr_max = math.inf
        for item in package["selectedItems"]:
            inventory_item = DB["inventory"].find_one({"itemName": item["itemName"]})
            curr_max = min(
                curr_max,
                math.floor(int(inventory_item["itemCount"]) / int(item["itemCount"])),
            )
        package["quantityAvailable"] = curr_max

    return dump_json(packages)


@app.route("/api/get_package_by_id", methods=["POST"])
def get_package_by_id():
    data = request.json
    package = DB["packages"].find_one({"_id": ObjectId(data["_id"])})
    return dump_json(package)


@app.route("/api/insert_item", methods=["POST"])
def insert_item():
    data = request.json
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].insert_one(data)
    log_action("insert_item", data=data)
    return jsonify({"message": "success"})


@app.route("/api/update_item", methods=["POST"])
def update_item():
    data = request.json
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].update_one({"_id": ObjectId(data["_id"])}, {"$set": data})
    log_action("update_item", data=data)
    return jsonify({"message": "success"})


@app.route("/api/get_personal_care_products", methods=["GET"])
def get_personal_care_products():
    products = list(DB["inventory"].find({"category": f"PersonalCareProduct"}))
    return dump_json(products)


@app.route("/api/create_package", methods=["POST"])
def create_package():
    data = request.json
    data["creation_date"] = datetime.now().strftime("%Y-%m-%d")
    data["creation_time"] = datetime.now().strftime("%H:%M:%S")
    DB["packages"].insert_one(data)
    log_action("create_package", data=data)
    return jsonify({"message": "success"})


@app.route("/api/fulfill_request", methods=["POST"])
def fullfil_request():
    data = request.json
    student_request = DB["requests"].find_one({"_id": ObjectId(data["_id"])})
    package = DB["packages"].find_one({"_id": ObjectId(student_request["packageId"])})
    # Update inventory count for each item
    for item in package["selectedItems"]:
        # TODO: Refactor inventory item to use _id instead of itemName
        inventory_item = DB["inventory"].find_one({"itemName": item["itemName"]})
        if int(inventory_item["itemCount"]) - int(item["itemCount"]) < 0:
            return jsonify(
                {
                    "status": "error",
                    "message": f"Not enough {inventory_item['itemName']} in stock",
                }
            )
        DB["inventory"].update_one(
            {"itemName": item["itemName"]},
            {
                "$set": {
                    "itemCount": int(inventory_item["itemCount"])
                    - int(item["itemCount"])
                }
            },
        )

    data["date_fulfilled"] = datetime.now().strftime("%Y-%m-%d")
    DB["requests"].update_one(
        {"_id": ObjectId(data["_id"])}, {"$set": {"fulfilled": 1}}
    )
    log_action("fulfill_request", data=data)
    return jsonify({"message": "success"})


@app.route("/api/decline_request", methods=["POST"])
def decline_request():
    data = request.json
    DB["requests"].update_one(
        {"_id": ObjectId(data["_id"])}, {"$set": {"fulfilled": -1}}
    )
    return jsonify({"message": "success"})


@app.route("/api/get_fulfilled_requests", methods=["GET"])
def get_fulfilled_requests():
    requests = list(DB["requests"].find({"fulfilled": 1}))
    return dump_json(requests)


@app.route("/api/get_unfulfilled_requests", methods=["GET"])
def get_unfulfilled_requests():
    requests = list(DB["requests"].find({"fulfilled": 0}))
    return dump_json(requests)


@app.route("/api/get_declined_requests", methods=["GET"])
def get_declined_requests():
    requests = list(DB["requests"].find({"fulfilled": -1}))
    return dump_json(requests)


if __name__ == "__main__":
    app.run(debug=True)
