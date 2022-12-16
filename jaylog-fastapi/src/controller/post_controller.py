from util import functions
from dto import post_dto
from dependencies import get_db
from fastapi import APIRouter, Depends, Path, Request
from fastapi.responses import JSONResponse
from service import post_service
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/v1/posts",
    tags=["post"]
)


@router.get("/{idx}")
async def get_post(idx: int = Path(), db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_post(idx, db)


@router.get("/")
async def get_posts(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_posts(db)


@router.post("/")
async def insert_post(reqDTO: post_dto.ReqInsertPost, request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.insert_post(reqDTO, request, db)
