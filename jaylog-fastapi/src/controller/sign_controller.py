from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from dto import sign_up_dto, sign_in_dto
from service import sign_service

router = APIRouter(
    prefix="/api/v1/public/sign",
    tags=["sign"]
)


@router.post("/up")
async def sign_up(reqDTO: sign_up_dto.Req, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_up(reqDTO, db)


@router.post("/in")
async def sign_in(reqDTO: sign_in_dto.Req, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_in(reqDTO, db)
