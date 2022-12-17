from datetime import datetime
from fastapi import Request
from sqlalchemy.orm import Session

from dto import post_dto
from entity.like_entity import LikeEntity
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity
from util import functions

AUTHORIZATION_ERROR = {"code": 1, "message": "인증되지 않은 사용자입니다."}
ID_NOT_EXIST_ERROR = {"code": 2, "message": "가입되지 않은 아이디 입니다."}
DELETED_USER_ERROR = {"code": 3, "message": "삭제된 회원입니다."}
POST_NOT_EXIST_ERROR = {"code": 4, "message": "해당 글이 없습니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def like_post(request: Request, post_idx: int, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=400, error_dict=AUTHORIZATION_ERROR)

    post_entity: PostEntity = db.query(PostEntity).filter(
        PostEntity.idx == post_idx).filter(
        PostEntity.delete_date == None).first()

    if post_entity == None:
        return functions.res_generator(400, POST_NOT_EXIST_ERROR)

    like_entity: LikeEntity = db.query(LikeEntity).filter()

    # if request.state.user == reqDTO

    # userEntity : UserEntity = db.query(UserEntity).filter()

    pass


def get_post(idx: int, db: Session):
    post_entity: PostEntity = db.query(PostEntity).filter(
        PostEntity.idx == idx).filter(
        PostEntity.delete_date == None).first()
    if post_entity == None:
        return functions.res_generator(400, POST_NOT_EXIST_ERROR)

    return functions.res_generator(content=post_dto.ResDetailPost.toDTO(post_entity))


def get_posts(db: Session):
    post_entity_list: list[PostEntity] = db.query(PostEntity).filter(
        PostEntity.delete_date == None).order_by(PostEntity.create_date.desc()).all()

    return functions.res_generator(content=list(map(post_dto.ResMainPost.toDTO, post_entity_list)))


def insert_post(request: Request, req_dto: post_dto.ReqInsertPost,  db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=401, error_dict=AUTHORIZATION_ERROR)

    user_entity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == request.state.user.idx).first()

    if (user_entity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (user_entity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    new_post = PostEntity(
        title=req_dto.title,
        content=req_dto.content,
        summary=req_dto.summary,
        thumbnail=req_dto.thumbnail,
        user_idx=user_entity.idx,
        create_date=datetime.now(),
    )

    try:
        db.add(new_post)
        db.flush()
    except Exception as e:
        db.rollback()
        print(e)
        return functions.res_generator(status_code=500, error_dict=INTERNAL_SERVER_ERROR, content=e)
    finally:
        db.commit()

    db.refresh(new_post)

    return functions.res_generator(status_code=201, content=post_dto.ResInsertPost(idx=new_post.idx))
