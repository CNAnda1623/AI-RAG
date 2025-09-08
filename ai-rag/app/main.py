# app/main.py
from fastapi import FastAPI
from app.routers import upload  # ensure module path matches your project
from fastapi import Body
from datetime import datetime
from app.db.models import Post
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(upload.router)  # root prefix; if you want prefix="/api", change here

@app.get("/")
def root():
    return {"message": "AI-RAG backend running"}

@app.post("/posts")
async def create_post(post: Post = Body(...)):
    post_dict = post.dict()
    post_dict["created_at"] = datetime.utcnow()
    result = await posts_collection.insert_one(post_dict)
    return {"success": True, "id": str(result.inserted_id)}

@app.get("/posts")
async def get_posts():
    posts = []
    async for p in posts_collection.find().sort("created_at", -1):
        p["_id"] = str(p["_id"])
        posts.append(p)

    if not posts:
        # fallback default posts
        posts = [
            {
                "title": "Welcome to Tedbus Community 🎉",
                "content": "This is a default post. Share your travel stories here!",
                "image_url": None,
                "author_name": "System",
                "author_pic": None,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
    return {"posts": posts}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(upload.router)

@app.get("/")
def root():
    return {"message": "AI-RAG backend running"}