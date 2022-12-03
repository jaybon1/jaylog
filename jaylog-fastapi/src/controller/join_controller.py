from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from dependencies import get_db
from dto.join_dto import Req
from service import join_service

router = APIRouter(
    prefix="/join",
    tags=["join"]
)


@router.post("/")
async def join(reqDTO: Req, db: Session = Depends(get_db)) -> JSONResponse:
    return join_service.join(reqDTO, db)
