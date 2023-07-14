import json
import math
import sys
from datetime import datetime

from bson import ObjectId
from flask import Flask, jsonify, request
from pymongo.mongo_client import MongoClient

# Run using local DB if "--local" is passed as an argument
if "--local" in sys.argv:
    print("Running using local DB")
    ATLAS_URI = "mongodb://localhost:27017"
    CLIENT = MongoClient(ATLAS_URI)
else:
# Run using Atlas DB. Developer must create and set ATLAS_URI in .fornear_secrets.py or environment variables.
    try:
        from .fornear_secrets import ATLAS_URI
    except ImportError:
        # use environment variables
        import os
        ATLAS_URI = os.environ.get("ATLAS_URI")
    if ATLAS_URI is None:
        raise Exception("ATLAS_URI not set")
    import certifi
    CLIENT = MongoClient(ATLAS_URI, tlsCAFile=certifi.where())


app = Flask(__name__)
DB = CLIENT["fornear-v1"]


# My own code
# https://github.com/It-s-Saturday/BillTracker/blob/c07f83c78f10259aed621f6c4d5ae9d526903898/backend/main.py#L25
def log_action(action, notes="", data={}):
    """Log create, update, delete actions to the log collection

    Args:
        action (str): The action that was performed
        notes (str, optional: Notes/comments about the action. Defaults to "".
        data (dict, optional): The data that was used to perform the action. Defaults to {}.
    """
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


@app.route("/api/get_inventory", methods=["GET"])
def get_inventory():
    """Get the inventory from the database

    Returns:
        Response: The inventory as a JSON response
    """
    inventory = list(DB["inventory"].find())
    return json.dumps(inventory, default=str)


@app.route("/api/update_inventory", methods=["POST"])
def update_inventory():
    """Update the inventory in the database

    data should be a JSON object with the following structure:

    {
        "auditor": "someone's name",
        "selectedItems": [
            {
                "itemName": "item1",
                "itemCount": 5
            },

            {
                "itemName": "item2",
                "itemCount": 10
            }
        ]
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    selectedItems = data["selectedItems"]
    for item in selectedItems:
        inventory_item = DB["inventory"].find_one({"itemName": item["itemName"]})
        if inventory_item is None:
            continue
        inventory_item["itemCount"] = item["itemCount"]
        DB["inventory"].update_one(
            {"_id": ObjectId(inventory_item["_id"])}, {"$set": inventory_item}
        )
    log_action("updateInventory", data=data)
    return jsonify({"message": "success"})


@app.route("/api/request_package", methods=["POST"])
def request_package():
    """(Student) Request a package

    data should be a JSON object with the following structure:

    {
        packageId: '000000000000000000000000',
        packageName: 'Package Name',
        name: 'Someone',
        email: 'someone@fakemail.com',
        phoneNumber: '555-555-5555',
        pickupDate: '2021-01-01',
        personalCareProducts: [
            'Toothbrush',
            'Toothpaste',
            'Deodorant',
        ],
        restrictions: '',
    }
    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["fulfilled"] = 0
    data["requestDate"] = datetime.now().strftime("%Y-%m-%d")
    data["requestTime"] = datetime.now().strftime("%H:%M:%S")
    DB["requests"].insert_one(data)
    log_action("requestPackage", data=data)
    return jsonify({"message": "success"})


@app.route("/api/get_requests", methods=["GET"])
def get_requests():
    """Get all requests

    Returns:
        Response: A JSON response with all requests
    """
    requests = list(
        DB["requests"].aggregate(
            [
                {"$match": {"fulfilled": 0}},
                {"$group": {"_id": "$packageId", "requests": {"$push": "$$ROOT"}}},
            ]
        )
    )
    for request_ in requests:
        package = DB["packages"].find_one({"_id": request_["requests"][0]["_id"]})
        if package is None:
            continue
        request_["packageName"] = package["packageName"]
    requests.sort(key=lambda x: x["requests"][0]["packageName"])
    return json.dumps(requests, default=str)


@app.route("/api/get_packages", methods=["GET"])
def get_packages():
    """Get all packages

    Returns:
        Response: A JSON response with all packages
    """
    packages = list(DB["packages"].find())

    for package in packages:
        curr_max = math.inf
        for item in package["selectedItems"]:
            inventory_item = DB["inventory"].find_one({"itemName": item["itemName"]})
            if inventory_item is None:
                continue
            curr_max = min(
                curr_max,
                math.floor(int(inventory_item["itemCount"]) / int(item["itemCount"])),
            )
        package["quantityAvailable"] = curr_max

    return json.dumps(packages, default=str)


@app.route("/api/get_package_by_id", methods=["POST"])
def get_package_by_id():
    """Get a package by its ID

    data should be a JSON object with the following structure:

    {
        "_id": {
            "$oid": "649d258978ab9985ce22081b"
        }
    }

    Returns:
        Response: A JSON response with the package
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    package = DB["packages"].find_one({"_id": ObjectId(data["_id"])})
    return json.dumps(package, default=str)

@app.route("/api/get_personal_care_products_by_request_id", methods=["POST"])
def get_personal_care_products_by_request_id():
    """Get a package by its ID
    
    data should be a JSON object with the following structure:
    
    {
        "_id": {
            "$oid": "649d258978ab9985ce22081b"
        }
    }

    Returns:
        Response: A JSON response; a list of personal care products in the request
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    request_ = DB["requests"].find_one({"_id": ObjectId(data["_id"])})
    if request_ is None:
        return jsonify({"message": "error"})
    products = []
    print(request_)
    if "personalCareProducts" in request_:
        current_personal_care_products = request_["personalCareProducts"]
        for _id in current_personal_care_products:
            inventory_item = DB["inventory"].find_one({"_id": ObjectId(_id)})
            if inventory_item is None:
                continue
            products.append(inventory_item["itemName"])
    return json.dumps(products, default=str)

@app.route("/api/insert_item", methods=["POST"])
def insert_item():
    """Insert an item into the inventory

    data should be a JSON object with the following structure:

    {
        "_id": {
            "$oid": "649d238278ab9985ce220817"
        },
        "itemName": "Jars",
        "itemCount": "20",
        "category": "Foodstuff"
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].insert_one(data)
    log_action("insertItem", data=data)
    return jsonify({"message": "success"})


@app.route("/api/update_item", methods=["POST"])
def update_item():
    """Update an item in the inventory

    data should be a JSON object with the following structure:

    {
        "_id": {
            "$oid": "649d238278ab9985ce220817"
        },
        "itemName": "Jars",
        "itemCount": "20",
        "category": "Foodstuff"
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["itemCount"] = int(data["itemCount"])
    DB["inventory"].update_one({"_id": ObjectId(data["_id"])}, {"$set": data})
    log_action("updateItem", data=data)
    return jsonify({"message": "success"})


@app.route("/api/get_personal_care_products", methods=["GET"])
def get_personal_care_products():
    """Get all personal care products

    Returns:
        Response: A JSON response with all personal care products
    """
    products = list(DB["inventory"].find({"category": "PersonalCareProduct"}))
    return json.dumps(products, default=str)


@app.route("/api/create_package", methods=["POST"])
def create_package():
    """Create a package

    data should be a JSON object with the following structure:

    {
        "packageName": "Just Beans",
        "author": "jayway",
        "description": "",
        "selectedItems": [
            {
            "itemName": "Canned Beans",
            "itemCount": 1
            }
        ],
        "quantityAvailable": 40,
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    data["creationDate"] = datetime.now().strftime("%Y-%m-%d")
    data["creationTime"] = datetime.now().strftime("%H:%M:%S")
    DB["packages"].insert_one(data)
    log_action("createPackage", data=data)
    return jsonify({"message": "success"})


@app.route("/api/fulfill_request", methods=["POST"])
def fullfil_request():
    """Fulfill a request

    data should be a JSON object with the following structure:

    {
        "_id": "5f9b3b3b9b9b9b9b9b9b9b9b",
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    student_request = DB["requests"].find_one({"_id": ObjectId(data["_id"])})
    if student_request is None:
        return jsonify({"message": "error"})
    package = DB["packages"].find_one({"_id": ObjectId(student_request["packageId"])})
    if package is None:
        return jsonify({"message": "error"})
    for item in package["selectedItems"]:
        # TODO: Refactor inventory item to use _id instead of itemName
        inventory_item = DB["inventory"].find_one({"itemName": item["itemName"]})
        if inventory_item is None:
            continue
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

    if "personalCareProducts" in student_request:
        for _id in student_request["personalCareProducts"]:
            inventory_item = DB["inventory"].find_one({"_id": ObjectId(_id)})
            if inventory_item is None:
                continue
            DB["inventory"].update_one(
                {"_id": ObjectId(_id)},
                {"$set": {"itemCount": int(inventory_item["itemCount"]) - 1}},
            )

    DB["requests"].update_one(
        {"_id": ObjectId(data["_id"])},
        {
            "$set": {
                "fulfilled": 1,
                "dateFulfilled": datetime.now().strftime("%Y-%m-%d"),
            }
        },
    )
    log_action("fulfillRequest", data=data)
    return jsonify({"message": "success"})


@app.route("/api/decline_request", methods=["POST"])
def decline_request():
    """Decline a request

    data should be a JSON object with the following structure:

    {
        "_id": "5f9b3b3b9b9b9b9b9b9b9b9b",
    }

    Returns:
        Response: A JSON response with a message of "success" or "error"
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    DB["requests"].update_one(
        {"_id": ObjectId(data["_id"])},
        {
            "$set": {
                "fulfilled": -1,
                "dateDeclined": datetime.now().strftime("%Y-%m-%d"),
            }
        },
    )
    return jsonify({"message": "success"})


@app.route("/api/get_special_requests", methods=["POST"])
def get_special_requests():
    """Get all fulfilled requests

    data should be a JSON object with the following structure:

    {
        "fulfilled": 0,
    }


    Returns:
        Response: A JSON response with all special( fulfilled, unfulfilled, declined) requests
    """
    data = request.json
    if data is None:
        return jsonify({"message": "error"})
    requests = list(DB["requests"].find({"fulfilled": data["fulfilled"]}))
    return json.dumps(requests, default=str)

'''
@app.route("/api/get_unfulfilled_requests", methods=["GET"])
def get_unfulfilled_requests():
    """Get all unfulfilled requests

    Returns:
        Response: A JSON response with all fulfilled requests
    """
    requests = list(DB["requests"].find({"fulfilled": 0}))
    return json.dumps(requests, default=str)


@app.route("/api/get_declined_requests", methods=["GET"])
def get_declined_requests():
    """Get all declined requests

    Returns:
        Response: A JSON response with all fulfilled requests
    """
    requests = list(DB["requests"].find({"fulfilled": -1}))
    return json.dumps(requests, default=str)
    '''

@app.route("/admin/get_logs", methods=["GET"])
def get_logs():
    """Get all logs

    Returns:
        Response: A JSON response with all logs, sorted by time descending
    """
    logs = list(DB["log"].find())
    logs.sort(key=lambda x: x["time"])
    return json.dumps(logs, default=str)


if __name__ == "__main__":
    app.run(debug=True)
