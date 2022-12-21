from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from service import user_service

router = APIRouter(
    prefix="/api/v1/user",
    tags=["user"]
)


@router.get("/my")
async def get_my_info(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    return user_service.get_my_info(request, db)


# @router.put("/my")
# async def user_my_update(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
#     pass
