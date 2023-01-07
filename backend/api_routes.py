from flask import Blueprint, jsonify, request
from pymongo import MongoClient

import os
client = MongoClient(os.getenv("MONGO_URI"))
db = client.blackcoffer_db
collection = db.records

# Blueprint for API
api = Blueprint('api', __name__)

@api.route('/api/data', methods=['GET'])
def get_data():
    query = {}

    # Supported filters (you can add more if you wish)
    filters = [
        'end_year', 'start_year', 'topic', 'sector', 'region', 
        'pestle', 'source', 'swot', 'country', 'city'
    ]

    for field in filters:
        value = request.args.get(field)
        if value:  # Add to query only if non-empty value provided
            query[field] = value

    # Fetch filtered data
    data = list(collection.find(query, {"_id": 0}))

    return jsonify(data)
