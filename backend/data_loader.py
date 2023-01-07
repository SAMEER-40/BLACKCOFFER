import json
from pymongo import MongoClient

import os
client = MongoClient(os.getenv("MONGO_URI"))

db = client.blackcoffer_db
collection = db.records

# Load Data
with open('jsondata.json', 'r', encoding='utf-8-sig') as file:
    data = json.load(file)

# Clear old data
collection.delete_many({})

# Insert new data
if isinstance(data, list):
    collection.insert_many(data)
else:
    collection.insert_one(data)

print("✅ Data Loaded Successfully!")
