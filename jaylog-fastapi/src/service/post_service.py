from datetime import datetime
from fastapi import Request
from sqlalchemy.orm import Session

from dto import post_dto
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity
from util import functions

AUTHORIZATION_ERROR = {"code": 1, "message": "인증되지 않은 사용자입니다."}
ID_NOT_EXIST_ERROR = {"code": 2, "message": "가입되지 않은 아이디 입니다."}
DELETED_USER_ERROR = {"code": 3, "message": "삭제된 회원입니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def get_posts(db: Session):
    postEntitys: list[PostEntity] = db.query(PostEntity).filter(
        PostEntity.delete_date == None).order_by(PostEntity.create_date.desc()).all()

    return functions.res_generator(content=list(map(post_dto.ResMainPost.toDTO, postEntitys)))


def insert_post(reqDTO: post_dto.ReqInsertPost, request: Request, db: Session):
    if not request.state.user:
        return functions.res_generator(status_code=401, error_dict=AUTHORIZATION_ERROR)

    userEntity: UserEntity = db.query(UserEntity).filter(
        UserEntity.idx == request.state.user.idx).first()

    if (userEntity == None):
        return functions.res_generator(400, ID_NOT_EXIST_ERROR)

    if (userEntity.delete_date != None):
        return functions.res_generator(400, DELETED_USER_ERROR)

    db_post = PostEntity(
        title=reqDTO.title,
        content=reqDTO.content,
        summary=reqDTO.summary,
        thumbnail=reqDTO.thumbnail,
        user_idx=userEntity.idx,
        create_date=datetime.now(),
    )

    try:
        db.add(db_post)
        db.flush()
    except Exception as e:
        db.rollback()
        print(e)
        return functions.res_generator(status_code=500, error_dict=INTERNAL_SERVER_ERROR, content=e)
    finally:
        db.commit()

    db.refresh(db_post)

    return functions.res_generator(status_code=201, content=post_dto.ResInsertPost(idx=db_post.idx))
