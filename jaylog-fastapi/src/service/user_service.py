import bcrypt
from fastapi import Request
from sqlalchemy.orm import Session

from dto import sign_dto, user_dto
from entity.like_entity import LikeEntity
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity
from util import functions

AUTHORIZATION_ERROR = {"code": 1, "message": "인증되지 않은 사용자입니다."}
ID_ERROR = {"code": 2, "message": "계정에 문제가 있습니다."}
SAME_PASSWORD_ERROR = {"code": 3, "message": "기존 비밀번호와 같습니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def change_info(request: Request, req_dto: user_dto.ReqUserChangeInfo, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=400, error_dict=AUTHORIZATION_ERROR)

    auth_user: sign_dto.AccessJwt = request.state.user

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == auth_user.idx).filter(
            UserEntity.delete_date == None).first()

    if user_entity == None:
        return functions.res_generator(400, ID_ERROR)

    if (req_dto.password == None):
        pass
    elif (bcrypt.checkpw(req_dto.password.encode("utf-8"), user_entity.password.encode("utf-8"))):
        return functions.res_generator(400, SAME_PASSWORD_ERROR)

    try:
        user_entity.profile_image = req_dto.profileImage
        user_entity.simple_desc = req_dto.simpleDesc if req_dto.simpleDesc else None

        if (req_dto.password != None):
            user_entity.password = bcrypt.hashpw(
                req_dto.password.encode("utf-8"), bcrypt.gensalt())

        db.flush()
    except Exception as e:
        db.rollback()
        print(e)
        return functions.res_generator(status_code=500, error_dict=INTERNAL_SERVER_ERROR, content=e)
    finally:
        db.commit()

    return functions.res_generator(error_dict={"code": 0, "message": "정상적으로 수정되었습니다.\n다시 로그인 해주세요."})


def get_my_info(request: Request, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=400, error_dict=AUTHORIZATION_ERROR)

    auth_user: sign_dto.AccessJwt = request.state.user

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == auth_user.idx).filter(
            UserEntity.delete_date == None).first()

    if user_entity == None:
        return functions.res_generator(400, ID_ERROR)

    my_post_list: list[PostEntity] = list(filter(
        lambda post_entity: post_entity.delete_date == None, user_entity.post_entity_list))

    like_post_idx_subquery = db.query(LikeEntity.post_idx).filter(
        LikeEntity.user_idx == auth_user.idx).filter(
            LikeEntity.delete_date == None).subquery()

    like_post_entity_list: list[PostEntity] = db.query(PostEntity).filter(
        PostEntity.idx.in_(like_post_idx_subquery)).filter(
            PostEntity.delete_date == None).all()

    return functions.res_generator(content=user_dto.ResUserMy.toDTO(my_post_list, like_post_entity_list))
