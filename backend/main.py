from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from fornear_secrets import ATLAS_PASS, ATLAS_USERNAME

if __name__ == "__main__":
    uri = f"mongodb+srv://{ATLAS_USERNAME}:{ATLAS_PASS}@ganso.koavv7w.mongodb.net/?retryWrites=true&w=majority"

    client = MongoClient(uri, server_api=ServerApi("1"))

    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
