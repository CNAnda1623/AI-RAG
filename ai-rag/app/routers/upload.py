from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.upload_service import upload_file_to_supabase
import logging

router = APIRouter(prefix="/api/files", tags=["files"])

# Configure logging
logging.basicConfig(level=logging.INFO)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a file to Supabase and save metadata to MongoDB.
    """
    try:
        # Log file info without consuming bytes
        file_bytes = await file.read()
        file_size = len(file_bytes)
        logging.info(f"📂 Received file: {file.filename}, size={file_size} bytes")
        await file.seek(0)  # Reset pointer for upload

        # Upload file via service
        result = await upload_file_to_supabase(file)

        return result

    except Exception as e:
        logging.error(f"❌ Error in /upload endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
