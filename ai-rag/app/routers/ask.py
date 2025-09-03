from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def test_ask():
    return {"message": "Ask route working"}
