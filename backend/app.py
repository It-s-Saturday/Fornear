import json
import math
from datetime import datetime

from bson import ObjectId
from flask import Flask, jsonify, request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import certifi

from .fornear_secrets import ATLAS_URI


def dumpJson(data):
    return json.dumps(data, default=str)


app = Flask(__name__)
CLIENT = MongoClient(ATLAS_URI, tlsCAFile=certifi.where())
DB = CLIENT["fornear-v1"]


# My own code
# https://github.com/It-s-Saturday/BillTracker/blob/c07f83c78f10259aed621f6c4d5ae9d526903898/backend/main.py#L25
def logAction(action, notes="", data={}):
    """ONLY USE IN INSERT, UPDATE, DELETE ACTIONS"""
    LOG_COLLECTION = DB["log"]
    LOG_COLLECTION.insert_one(
        {
            "action": action,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H:%M:%S"),
            "payload": str(data),
            "notes": notes,
        }
    )


@app.route("/api/getInventory", methods=["GET"])
def getInventory():
    inventory = list(DB["inventory"].find())
    return dumpJson(inventory)


@app.route("/api/updateInventory", methods=["POST"])
def updateInventory():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    selectedItems = data["selectedItems"]
    for item in selectedItems:
        inventoryItem = DB["inventory"].find_one({"itemName": item["itemName"]})
        if inventoryItem is None:
            continue
        inventoryItem["itemCount"] = item["itemCount"]
        DB["inventory"].update_one(
            {"Id": ObjectId(inventoryItem["Id"])}, {"$set": inventoryItem}
        )
    return jsonify({"message": "success"})


@app.route("/api/requestPackage", methods=["POST"])
def requestPackage():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["fulfilled"] = 0
    data["requestDate"] = datetime.now().strftime("%Y-%m-%d")
    data["requestTime"] = datetime.now().strftime("%H:%M:%S")
    DB["requests"].insert_one(data)
    log_action("requestPackage", data=data)
    return jsonify({"message": "success"})


@app.route("/api/getRequests", methods=["GET"])
def getRequests():
    requests = list(
        DB["requests"].aggregate(
            [
                {"$match": {"fulfilled": 0}},
                {"$group": {"Id": "$packageId", "requests": {"$push": "$$ROOT"}}},
            ]
        )
    )
    for request in requests:
        package = DB["packages"].find_one({"Id": ObjectId(request["Id"])})
        if package is None:
            continue
        request["packageName"] = package["packageName"]
    requests.sort(key=lambda x: x["packageName"])
    return dumpJson(requests)


@app.route("/api/getPackages", methods=["GET"])
def getPackages():
    packages = list(DB["packages"].find())

    for package in packages:
        currMax = math.inf
        for item in package["selectedItems"]:
            inventoryItem = DB["inventory"].find_one({"itemName": item["itemName"]})
            if inventoryItem is None:
                continue
            currMax = min(
                currMax,
                math.floor(int(inventoryItem["itemCount"]) / int(item["itemCount"])),
            )
        package["quantityAvailable"] = currMax

    return dumpJson(packages)


@app.route("/api/getPackageById", methods=["POST"])
def getPackageById():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    package = DB["packages"].find_one({"Id": ObjectId(data["Id"])})
    return dumpJson(package)


@app.route("/api/insertItem", methods=["POST"])
def insertItem():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].insert_one(data)
    log_action("insertItem", data=data)
    return jsonify({"message": "success"})


@app.route("/api/updateItem", methods=["POST"])
def updateItem():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].update_one({"Id": ObjectId(data["Id"])}, {"$set": data})
    log_action("updateItem", data=data)
    return jsonify({"message": "success"})


@app.route("/api/getPersonalCareProducts", methods=["GET"])
def getPersonalCareProducts():
    products = list(DB["inventory"].find({"category": f"PersonalCareProduct"}))
    return dumpJson(products)


@app.route("/api/createPackage", methods=["POST"])
def createPackage():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["creationDate"] = datetime.now().strftime("%Y-%m-%d")
    data["creationTime"] = datetime.now().strftime("%H:%M:%S")
    DB["packages"].insert_one(data)
    log_action("createPackage", data=data)
    return jsonify({"message": "success"})


@app.route("/api/fulfillRequest", methods=["POST"])
def fulfillRequest():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    student_request = DB["requests"].find_one({"Id": ObjectId(data["Id"])})
    if student_request is None:
        return jsonify({"message": "error"})
    package = DB["packages"].find_one({"Id": ObjectId(student_request["packageId"])})
    if package is None:
        return jsonify({"message": "error"})
    for item in package["selectedItems"]:
        # TODO: Refactor inventory item to use _id instead of itemName
        inventoryItem = DB["inventory"].find_one({"itemName": item["itemName"]})
        if inventoryItem is None:
            continue
        if int(inventoryItem["itemCount"]) - int(item["itemCount"]) < 0:
            return jsonify(
                {
                    "status": "error",
                    "message": f"Not enough {inventoryItem['itemName']} in stock",
                }
            )
        DB["inventory"].update_one(
            {"itemName": item["itemName"]},
            {
                "$set": {
                    "itemCount": int(inventoryItem["itemCount"])
                    - int(item["itemCount"])
                }
            },
        )

    DB["requests"].update_one(
        {"Id": ObjectId(data["Id"])},
        {
            "$set": {
                "fulfilled": 1,
                "dateFulfilled": datetime.now().strftime("%Y-%m-%d"),
            }
        },
    )
    log_action("fulfillRequest", data=data)
    return jsonify({"message": "success"})


@app.route("/api/declineRequest", methods=["POST"])
def declineRequest():
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    DB["requests"].update_one(
        {"Id": ObjectId(data["Id"])},
        {
            "$set": {
                "fulfilled": -1,
                "dateDeclined": datetime.now().strftime("%Y-%m-%d"),
            }
        },
    )
    return jsonify({"message": "success"})


@app.route("/api/getFulfilledRequests", methods=["GET"])
def getFulfilledRequests():
    requests = list(DB["requests"].find({"fulfilled": 1}))
    return dumpJson(requests)


@app.route("/api/getUnfulfilledRequests", methods=["GET"])
def getUnfulfilledRequests():
    requests = list(DB["requests"].find({"fulfilled": 0}))
    return dumpJson(requests)


@app.route("/api/getDeclinedRequests", methods=["GET"])
def getDeclinedRequests():
    requests = list(DB["requests"].find({"fulfilled": -1}))
    return dumpJson(requests)


@app.route("/admin/getLogs", methods=["GET"])
def getLogs():
    logs = list(DB["log"].find())
    logs.sort(key=lambda x: x["time"])
    return dumpJson(logs)


if __name__ == "__main__":
    app.run(debug=True)
