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


@router.get("/{post_idx}")
async def get_post(request: Request, post_idx: int = Path(), update: bool = False, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_post(request, post_idx, update, db)


@router.put("/{post_idx}")
async def update_post(request: Request, req_dto: post_dto.ReqUpdatePost, post_idx: int = Path(), db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.update_post(request, req_dto, post_idx, db)


@router.delete("/{post_idx}")
async def delete_post(request: Request, post_idx: int = Path(), db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.delete_post(request, post_idx, db)


@router.get("")
@router.get("/")
async def get_posts(search: str = "", db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.get_posts(search, db)


@router.post("")
@router.post("/")
async def insert_post(request: Request, req_dto: post_dto.ReqInsertPost, db: Session = Depends(get_db)) -> JSONResponse:
    return post_service.insert_post(request, req_dto, db)
