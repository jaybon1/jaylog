from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from dto.login_dto import Req
from service import login_service

router = APIRouter(
    prefix="/login",
    tags=["login"]
)


@router.post("/")
async def login(reqDTO: Req, db: Session = Depends(get_db)) -> JSONResponse:
    return login_service.login(reqDTO, db)
