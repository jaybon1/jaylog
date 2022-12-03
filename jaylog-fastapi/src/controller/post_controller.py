from dependencies import get_db
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from service import post_service
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/v1/public/posts",
    tags=["post"]
)


@router.get("/")
async def get_posts(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_posts(db)
