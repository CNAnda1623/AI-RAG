from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class Org(BaseModel):
    """Schema for organization data."""
    org_name: str
    api_key: str
    documents: list = []


class Doc(BaseModel):
    """Schema for uploaded document metadata."""
    file_name: str
    file_type: str
    org_id: str
    status: str = "uploaded"  # or "processed"


class Post(BaseModel):
    """Schema for community posts."""
    title: str
    content: str
    image_url: Optional[HttpUrl] = None
    author_name: str
    author_pic: Optional[str] = None
    created_at: datetime = datetime.utcnow()


class Document(BaseModel):
    """Schema for uploaded document details."""
    filename: str
    public_url: str
    uploaded_at: datetime = datetime.utcnow()
