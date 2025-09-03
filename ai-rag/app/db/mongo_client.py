# app/db/mongo_client.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import ssl
from app.db.models import Post

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("DB_NAME", "ai_rag_db")

if not MONGO_URI:
    raise EnvironmentError("MONGO_URI must be set in .env")

_client = MongoClient(MONGO_URI, tls = True)
_db = _client[MONGO_DB]

documents_collection = _db["documents"]

def get_db():
    return _db

def get_collection(name: str):
    return _db[name]
