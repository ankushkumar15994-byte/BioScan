import os
from pymongo import MongoClient

# Get MONGO_URI from environment variables
MONGO_URI = os.environ.get("MONGO_URI")

# We will initialize the client gracefully so the app doesn't crash 
# immediately if the user hasn't added the MONGO_URI yet.
db_client = None
db = None
users_collection = None
scans_collection = None

if MONGO_URI:
    try:
        db_client = MongoClient(MONGO_URI)
        db = db_client["bioscan_db"]
        users_collection = db["users"]
        scans_collection = db["scans"]
        # Create a unique index on email
        users_collection.create_index("email", unique=True)
        print("Connected to MongoDB Atlas!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
else:
    print("WARNING: MONGO_URI is not set in the environment variables. Authentication will fail.")
