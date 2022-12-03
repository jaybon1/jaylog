from dependencies import get_db
from dto import login_dto
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from service import post_service
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/post",
    tags=["post"]
)


@router.get("/")
async def get_posts(request: Request, db: Session = Depends(get_db)) -> JSONResponse:
    jwt_user: login_dto.Jwt = request.state.jwt_user
    print(jwt_user)
    return post_service.get_posts(db)
