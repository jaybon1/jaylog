from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from service import post_service

from dependencies import get_db

router = APIRouter(
    prefix="/post",
    tags=["post"]
)


@router.get("/")
async def get_posts(db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_posts(db)
