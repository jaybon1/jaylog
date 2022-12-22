from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from dto import sign_dto
from service import sign_service

router = APIRouter(
    prefix="/api/v1/sign",
    tags=["sign"]
)


@router.post("/check")
async def sign_check(request: Request, req_dto: sign_dto.ReqCheckUser, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_check(request, req_dto, db)


@router.post("/up")
async def sign_up(req_dto: sign_dto.ReqSignUp, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_up(req_dto, db)


@router.post("/in")
async def sign_in(req_dto: sign_dto.ReqSignIn, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_in(req_dto, db)


@router.post("/refresh")
async def sign_refresh(req_dto: sign_dto.ReqRefresh, db: Session = Depends(get_db)) -> JSONResponse:
    return sign_service.sign_refresh(req_dto, db)
