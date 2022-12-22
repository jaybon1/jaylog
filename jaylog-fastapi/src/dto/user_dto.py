from pydantic import BaseModel
# from datetime import datetime
from entity.post_entity import PostEntity
# from entity.user_entity import UserEntity
# from entity.like_entity import LikeEntity
from dto import post_dto


class ReqUserChangeInfo(BaseModel):
    profileImage: str
    password: str | None = None
    simpleDesc: str


class ResUserMy(BaseModel):

    # DTO를 따로 만들어야 하지만 편의를 위해서 ResMainPost를 가져다 씀
    # 실무에서는 내부 class를 만들어서 사용하는 것을 추천
    myPostList: list[post_dto.ResMainPost]
    likePostList: list[post_dto.ResMainPost]

    class Config:
        orm_mode = True

    @ staticmethod
    def toDTO(my_post_entity_list: list[PostEntity], like_post_entity_list: list[PostEntity]):
        return ResUserMy(
            myPostList=sorted([post_dto.ResMainPost.toDTO(
                post_entity) for post_entity in my_post_entity_list], key=lambda x: x.idx, reverse=True),
            likePostList=sorted([post_dto.ResMainPost.toDTO(
                post_entity) for post_entity in like_post_entity_list], key=lambda x: x.idx, reverse=True)
        )
