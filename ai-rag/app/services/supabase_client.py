# app/services/supabase_client.py
import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi import UploadFile

load_dotenv()  # Load .env from project root

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "documents")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


async def upload_to_supabase(file: UploadFile, safe_name: str) -> str:
    """
    Uploads file to Supabase storage and returns its public URL.
    - file: FastAPI UploadFile
    - safe_name: cleaned filename to save in storage
    """
    # Read file contents
    contents = await file.read()

    # Upload the file
    res = supabase.storage.from_(SUPABASE_BUCKET).upload(
        safe_name,
        contents,
        {
            "content-type": file.content_type or "application/octet-stream",
            "upsert": True,
        }
    )

    if isinstance(res, dict) and res.get("error"):
        raise Exception(f"Supabase upload failed: {res['error']}")

    # Construct public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{safe_name}"
    return public_url
