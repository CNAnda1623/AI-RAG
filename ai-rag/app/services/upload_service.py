import os
import logging
from datetime import datetime
from supabase import create_client
from app.db.mongo_client import files_collection
from app.services.supabase_client import SUPABASE_BUCKET

# Logging
logging.basicConfig(level=logging.INFO)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def upload_file_to_supabase(file):
    """
    Upload a file to Supabase, store metadata in MongoDB, and return public URL.
    """
    try:
        logging.info(f"Starting upload for file: {file.filename}")

        # Read file bytes
        file_bytes = await file.read()
        await file.seek(0)  # Reset pointer
        if not file_bytes:
            raise ValueError("File is empty or could not be read.")

        # Upload to Supabase
        upload_res = supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=file.filename,
            file=file_bytes,
            file_options={"content_type": file.content_type}
        )

        logging.info(f"Supabase upload response: {upload_res}")

        # upload_res is UploadResponse object; if no exception, upload succeeded

        # Generate public URL (for public bucket)
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{file.filename}"
        logging.info(f"Public URL: {public_url}")

        # Save metadata to MongoDB
        doc = {
            "filename": file.filename,
            "supabase_name": file.filename,
            "public_url": public_url,
            "content_type": file.content_type,
            "size_bytes": len(file_bytes),
            "uploaded_at": datetime.utcnow()
        }
        result = files_collection.insert_one(doc)
        logging.info(f"Inserted document ID: {result.inserted_id}")

        return {
            "message": "File uploaded successfully",
            "url": public_url,
            "mongo_id": str(result.inserted_id)
        }

    except Exception as e:
        logging.error(f"File upload failed: {str(e)}")
        raise
