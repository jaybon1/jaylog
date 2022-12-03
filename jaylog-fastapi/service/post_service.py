from datetime import datetime
from sqlalchemy.orm import Session

from dto import post_dto
from entity.post_entity import PostEntity
from util import functions

INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def get_posts(db: Session):
    postEntitys: list[PostEntity] = db.query(PostEntity).filter(
        PostEntity.delete_date == None).order_by(PostEntity.create_date.desc()).all()

    return functions.res_generator(content=list(map(post_dto.Res.toDTO, postEntitys)))
