from datetime import datetime

import bcrypt
from sqlalchemy.orm import Session

from entity.user_entity import UserEntity

from dto import join_dto
from util import functions

USER_ID_EXIST_ERROR = {"code": 1, "message": "이미 존재하는 아이디입니다."}
INTERNAL_SERVER_ERROR = {"code": 99, "message": "서버 내부 에러입니다."}


def join(reqDTO: join_dto.Req, db: Session):

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

    return functions.res_generator(status_code=201, content=join_dto.Res(idx=db_user.idx))
