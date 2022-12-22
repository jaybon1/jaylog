from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from service import user_service
from dto import user_dto

router = APIRouter(
    prefix="/api/v1/user",
    tags=["user"]
)


@router.put("/change")
async def change_info(request: Request, req_dto: user_dto.ReqUserChangeInfo, db: Session = Depends(get_db)):
    return user_service.change_info(request, req_dto, db)


@router.get("/my")
async def get_my_info(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    return user_service.get_my_info(request, db)
