import time
from datetime import datetime

import bcrypt
import jwt
from config import const
from dto import sign_up_dto, sign_in_dto
from entity.user_entity import UserEntity
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from util import functions

USER_ID_EXIST_ERROR = {"code": 1, "message": "이미 존재하는 아이디입니다."}
ID_NOT_EXIST_ERROR = {"code": 2, "message": "가입되지 않은 아이디 입니다."}
DELETED_USER_ERROR = {"code": 3, "message": "삭제된 회원입니다."}
PASSWORD_INCORRECT_ERROR = {"code": 4, "message": "비밀번호가 일치하지 않습니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def sign_up(reqDTO: sign_up_dto.Req, db: Session):

    userEntity: UserEntity = db.query(UserEntity).filter(
        UserEntity.id == reqDTO.id).first()

    if (userEntity != None):
        return functions.res_generator(400, USER_ID_EXIST_ERROR)

    db_user = UserEntity(
        id=reqDTO.id,
        password=bcrypt.hashpw(
            reqDTO.password.encode("utf-8"), bcrypt.gensalt()),
        simple_desc=reqDTO.simpleDesc if reqDTO.simpleDesc else "한 줄 소개가 없습니다.",
        profile_image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        role="BLOGER",
        create_date=datetime.now(),
    )

    try:
        db.add(db_user)
        db.flush()
    except Exception as e:
        db.rollback()
        print(e)
        return functions.res_generator(status_code=500, error_dict=INTERNAL_SERVER_ERROR, content=e)
    finally:
        db.commit()

    db.refresh(db_user)

    return functions.res_generator(status_code=201, content=sign_up_dto.Res(idx=db_user.idx))


def sign_in(reqDTO: sign_in_dto.Req, db: Session):

    userEntity: UserEntity = db.query(UserEntity).filter(
        UserEntity.id == reqDTO.id).first()

    if (userEntity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (userEntity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    if (not bcrypt.checkpw(reqDTO.password.encode("utf-8"), userEntity.password.encode("utf-8"))):
        return functions.res_generator(400, PASSWORD_INCORRECT_ERROR)

    jwtDTO = sign_in_dto.Jwt(
        idx=userEntity.idx,
        id=userEntity.id,
        simpleDesc=userEntity.simple_desc,
        profileImage=userEntity.profile_image,
        role=userEntity.role,
        exp=time.time() + const.JWT_EXP_SECONDS
    )

    accessToken = jwt.encode(jsonable_encoder(jwtDTO),
                             const.JWT_SALT, algorithm="HS256")
    refreshToken = "준비중"

    return functions.res_generator(status_code=200, content=sign_in_dto.Res(accessToken=accessToken, refreshToken=refreshToken))
