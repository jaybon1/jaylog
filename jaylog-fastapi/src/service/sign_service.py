import time
from datetime import datetime

import bcrypt
import jwt
from config import constants
from dto import sign_dto
from entity.user_entity import UserEntity
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from util import functions
from fastapi import Request

USER_ID_EXIST_ERROR = {"code": 1, "message": "이미 존재하는 아이디입니다."}
ID_NOT_EXIST_ERROR = {"code": 2, "message": "가입되지 않은 아이디 입니다."}
DELETED_USER_ERROR = {"code": 3, "message": "삭제된 회원입니다."}
PASSWORD_INCORRECT_ERROR = {"code": 4, "message": "비밀번호가 일치하지 않습니다."}
REFRESH_TOKEN_ERROR = {"code": 5, "message": "리프레시 토큰이 유효하지 않습니다."}
ACCESS_TOKEN_ERROR = {"code": 6, "message": "액세스 토큰이 유효하지 않습니다."}
AUTHORIZATION_ERROR = {"code": 7, "message": "인증되지 않은 사용자입니다."}
ID_ERROR = {"code": 8, "message": "계정에 문제가 있습니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def sign_check(request: Request, req_dto: sign_dto.ReqCheckUser, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=400, error_dict=AUTHORIZATION_ERROR)

    auth_user: sign_dto.AccessJwt = request.state.user

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == auth_user.idx).filter(
            UserEntity.delete_date == None).first()

    if user_entity == None:
        return functions.res_generator(400, ID_ERROR)

    if (not bcrypt.checkpw(req_dto.password.encode("utf-8"), user_entity.password.encode("utf-8"))):
        return functions.res_generator(400, PASSWORD_INCORRECT_ERROR)

    access_token, refresh_token = gen_token(user_entity)

    return functions.res_generator(content=sign_dto.ResCheckUser(accessToken=access_token, refreshToken=refresh_token))


def sign_up(req_dto: sign_dto.ReqSignUp, db: Session):

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.id == req_dto.id).first()

    if (user_entity != None):
        return functions.res_generator(400, USER_ID_EXIST_ERROR)

    sign_up_user = UserEntity(
        id=req_dto.id,
        password=bcrypt.hashpw(
            req_dto.password.encode("utf-8"), bcrypt.gensalt()),
        simple_desc=req_dto.simpleDesc if req_dto.simpleDesc else None,
    )

    try:
        db.add(sign_up_user)
        db.flush()
    except Exception as e:
        db.rollback()
        print(e)
        return functions.res_generator(status_code=500, error_dict=INTERNAL_SERVER_ERROR, content=e)
    finally:
        db.commit()

    db.refresh(sign_up_user)

    return functions.res_generator(status_code=201, content=sign_dto.ResSignUp(idx=sign_up_user.idx))


def sign_in(req_dto: sign_dto.ReqSignIn, db: Session):

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.id == req_dto.id).first()

    if (user_entity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (user_entity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    if (not bcrypt.checkpw(req_dto.password.encode("utf-8"), user_entity.password.encode("utf-8"))):
        return functions.res_generator(400, PASSWORD_INCORRECT_ERROR)

    access_token, refresh_token = gen_token(user_entity)

    return functions.res_generator(status_code=200, content=sign_dto.ResSignIn(accessToken=access_token, refreshToken=refresh_token))


def sign_refresh(req_dto: sign_dto.ReqRefresh, db: Session):

    try:
        refresh_jwt_dto = sign_dto.RefreshJwt.toDTO(jwt.decode(
            req_dto.refreshToken, constants.JWT_SALT, algorithms=["HS256"]))
    except:
        return functions.res_generator(status_code=400, error_dict=REFRESH_TOKEN_ERROR)

    if (refresh_jwt_dto.exp < time.time()):
        return functions.res_generator(status_code=400, error_dict=REFRESH_TOKEN_ERROR)

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == refresh_jwt_dto.idx).first()

    if (user_entity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (user_entity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    access_token, refresh_token = gen_token(user_entity)

    return functions.res_generator(status_code=200, content=sign_dto.ResRefresh(accessToken=access_token, refreshToken=refresh_token))


def gen_token(user_entity):
    access_jwt_dto = sign_dto.AccessJwt(
        idx=user_entity.idx,
        id=user_entity.id,
        simpleDesc=user_entity.simple_desc,
        profileImage=user_entity.profile_image,
        role=user_entity.role,
        exp=time.time() + constants.JWT_ACCESS_EXP_SECONDS
    )

    access_token = jwt.encode(jsonable_encoder(access_jwt_dto),
                              constants.JWT_SALT, algorithm="HS256")

    refresh_jwt_dto = sign_dto.RefreshJwt(
        idx=user_entity.idx,
        exp=time.time() + constants.JWT_REFRESH_EXP_SECONDS
    )

    refresh_token = jwt.encode(jsonable_encoder(refresh_jwt_dto),
                               constants.JWT_SALT, algorithm="HS256")

    return access_token, refresh_token
