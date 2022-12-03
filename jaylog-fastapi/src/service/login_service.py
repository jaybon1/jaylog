import time

import bcrypt
import jwt
from config import const
from dto import login_dto
from entity.user_entity import UserEntity
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from util import functions

ID_NOT_EXIST_ERROR = {"code": 1, "message": "가입되지 않은 아이디 입니다."}
DELETED_USER_ERROR = {"code": 2, "message": "삭제된 회원입니다."}
PASSWORD_INCORRECT_ERROR = {"code": 3, "message": "비밀번호가 일치하지 않습니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def login(reqDTO: login_dto.Req, db: Session):

    userEntity: UserEntity = db.query(UserEntity).filter(
        UserEntity.id == reqDTO.id).first()

    if (userEntity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (userEntity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    if (not bcrypt.checkpw(reqDTO.password.encode("utf-8"), userEntity.password.encode("utf-8"))):
        return functions.res_generator(400, PASSWORD_INCORRECT_ERROR)

    jwtDTO = login_dto.Jwt(
        idx=userEntity.idx,
        id=userEntity.id,
        simpleDesc=userEntity.simple_desc,
        profileImage=userEntity.profile_image,
        role=userEntity.role,
        exp=time.time() + const.JWT_EXP_SECONDS
    )

    dict(jwtDTO)

    accessToken = jwt.encode(jsonable_encoder(jwtDTO),
                             const.JWT_SALT, algorithm="HS256")
    refreshToken = "준비중"

    return functions.res_generator(status_code=200, content=login_dto.Res(accessToken=accessToken, refreshToken=refreshToken))
