import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["dorm_db"]

dorms = db["dormitories"]
rooms = db["rooms"]
facilities = db["facilities"]
conversations = db["conversations"]
