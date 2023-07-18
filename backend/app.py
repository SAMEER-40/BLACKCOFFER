from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client.blackcoffer_db

collection = db.records

# Updated filter list based on your needs
FILTER_FIELDS = [
    'end_year', 'start_year', 'topic', 'sector', 'region', 
    'pestle', 'source', 'swot', 'country', 'city'
]

# Optional fields that can exist but might not be mandatory
OPTIONAL_FIELDS = [
    'intensity', 'insight', 'url', 'impact', 'added', 
    'published', 'relevance', 'title', 'likelihood'
]

@app.route('/', methods=['GET'])
def get_data():
    filters = {}

    # Process exact match filters (supports multiple values like ?topic=A&topic=B)
    for field in FILTER_FIELDS:
        values = request.args.getlist(field)
        if values:
            if len(values) == 1:
                filters[field] = values[0]  # Single value
            else:
                filters[field] = {"$in": values}  # Multiple values (multi-select support)

    # Optional filters (these can be added if you want additional search features)
    for field in OPTIONAL_FIELDS:
        value = request.args.get(field)
        if value:
            filters[field] = value

    # Special case: Support year range (e.g., start_year >= X and end_year <= Y)
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    
    if start_year or end_year:
        year_filter = {}
        if start_year:
            year_filter['$gte'] = int(start_year)
        if end_year:
            year_filter['$lte'] = int(end_year)
        filters['start_year'] = year_filter

    # Fetch data from MongoDB
    data = list(collection.find(filters, {"_id": 0}))  # Exclude MongoDB's _id field
    return jsonify(data)

@app.route('/api/filter-options', methods=['GET'])
def get_filter_options():
    # Aggregation query to get distinct filter values for dropdowns
    pipeline = [
        {
            "$group": {
                "_id": None,
                "end_year": {"$addToSet": "$end_year"},
                "start_year": {"$addToSet": "$start_year"},
                "topic": {"$addToSet": "$topic"},
                "sector": {"$addToSet": "$sector"},
                "region": {"$addToSet": "$region"},
                "pestle": {"$addToSet": "$pestle"},
                "source": {"$addToSet": "$source"},
                "swot": {"$addToSet": "$swot"},
                "country": {"$addToSet": "$country"},
                "city": {"$addToSet": "$city"}
            }
        },
        {"$project": {"_id": 0}}  # Remove _id field from output
    ]

    result = list(collection.aggregate(pipeline))
    return jsonify(result[0] if result else {})

if __name__ == '__main__':
    app.run(debug=True)
