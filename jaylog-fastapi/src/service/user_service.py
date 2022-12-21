from fastapi import Request
from sqlalchemy.orm import Session

from dto import sign_dto, user_dto
from entity.like_entity import LikeEntity
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity
from util import functions

AUTHORIZATION_ERROR = {"code": 1, "message": "인증되지 않은 사용자입니다."}
ID_ERROR = {"code": 2, "message": "계정에 문제가 있습니다."}


def get_my_info(request: Request, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=400, error_dict=AUTHORIZATION_ERROR)

    auth_user: sign_dto.AccessJwt = request.state.user

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == auth_user.idx).filter(
            UserEntity.delete_date == None).first()

    if user_entity == None:
        return functions.res_generator(400, ID_ERROR)

    my_post_list: list[PostEntity] = user_entity.post_entity_list

    like_post_idx_subquery = db.query(LikeEntity.post_idx).filter(
        LikeEntity.user_idx == auth_user.idx).filter(
            LikeEntity.delete_date == None).subquery()

    like_post_entity_list: list[PostEntity] = db.query(PostEntity).filter(
        PostEntity.idx.in_(like_post_idx_subquery)).filter(
            PostEntity.delete_date == None).all()

    return functions.res_generator(content=user_dto.ResUserMy.toDTO(my_post_list, like_post_entity_list))
