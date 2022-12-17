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


@router.post("/like/{post_idx}")
async def insert_post(request: Request, post_idx: int = Path(), db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.like_post(request, post_idx, db)


@router.get("/{idx}")
async def get_post(request: Request, idx: int = Path(), db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_post(request, idx, db)


@router.get("/")
async def get_posts(db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_posts(db)


@router.post("/")
async def insert_post(request: Request, req_dto: post_dto.ReqInsertPost, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.insert_post(request, req_dto, db)
