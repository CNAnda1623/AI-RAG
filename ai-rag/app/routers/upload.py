# app/routers/upload.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from datetime import datetime
import os
import re

from app.services.supabase_client import supabase, SUPABASE_BUCKET, SUPABASE_URL
from app.db.mongo_client import documents_collection

router = APIRouter()


@router.get("/upload", response_class=HTMLResponse)
async def upload_form():
    """Simple HTML form for manual file uploads (testing)."""
    return """
    <html><body>
    <h3>Upload file (POST /upload)</h3>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input name="file" type="file" />
      <input type="submit" value="Upload"/>
    </form>
    </body></html>
    """


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Handles file upload:
    - Stores file in Supabase Storage
    - Saves metadata in MongoDB
    - Returns stored document info
    """
    try:
        # Read file contents
        contents = await file.read()

        # Extract file extension, default to .pdf
        file_extension = os.path.splitext(file.filename)[1] or ".pdf"

        # Sanitize filename
        base_name = os.path.splitext(file.filename)[0]
        safe_base_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", base_name)

        # Add timestamp to prevent collisions
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_name = f"{timestamp}_{safe_base_name}{file_extension}"

        # Upload file to Supabase Storage
        upload_res = supabase.storage.from_(SUPABASE_BUCKET).upload(
            safe_name,
            contents,
            {"content-type": file.content_type},
        )

        # Handle upload error
        if isinstance(upload_res, dict) and upload_res.get("error"):
            raise HTTPException(status_code=500, detail=str(upload_res["error"]))

        # Build public URL manually
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{safe_name}"

        # Save metadata to MongoDB
        doc = {
            "filename": file.filename,
            "stored_path": safe_name,
            "public_url": public_url,
            "content_type": file.content_type,
            "size_bytes": len(contents),
            "uploaded_at": datetime.utcnow(),
        }
        inserted = documents_collection.insert_one(doc)
        doc["_id"] = str(inserted.inserted_id)

        return {"success": True, "file": doc}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
