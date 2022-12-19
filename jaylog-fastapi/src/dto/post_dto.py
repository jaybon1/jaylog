from pydantic import BaseModel
from datetime import datetime
from dto import sign_dto
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity


class ReqUpdatePost(BaseModel):
    title: str
    summary: str
    content: str
    thumbnail: str | None


class ResSetUpdatePost(BaseModel):

    idx: int
    title: str
    content: str

    class Config:
        orm_mode = True

    @staticmethod
    def toDTO(post_entity: PostEntity):
        return ResSetUpdatePost(
            idx=post_entity.idx,
            title=post_entity.title,
            content=post_entity.content
        )


class ResLikePost(BaseModel):
    likeCount: int
    likeClicked: bool

    class Config:
        orm_mode = True


class ResDetailPost(BaseModel):

    class _Writer(BaseModel):
        idx: int
        id: str
        profileImage: str

        class Config:
            orm_mode = True

        @staticmethod
        def toDTO(user_entity: UserEntity):
            return ResDetailPost._Writer(
                idx=user_entity.idx,
                id=user_entity.id,
                profileImage=user_entity.profile_image
            )

    idx: int
    title: str
    content: str
    likeCount: int
    createDate: datetime
    writer: _Writer
    likeClicked: bool

    class Config:
        orm_mode = True

    @staticmethod
    def toDTO(post_entity: PostEntity, auth_user: sign_dto.AccessJwt | None):
        active_like_list = list(filter(lambda like_entity: like_entity.delete_date == None,
                                       post_entity.like_entity_list))

        like_count = len(active_like_list)

        like_clicker_list = list(
            map(lambda like_entity: like_entity.user_idx, active_like_list))

        like_clicked = False
        if auth_user != None and auth_user.idx in like_clicker_list:
            like_clicked = True

        return ResDetailPost(
            idx=post_entity.idx,
            title=post_entity.title,
            content=post_entity.content,
            likeCount=like_count,
            createDate=post_entity.create_date,
            writer=ResDetailPost._Writer.toDTO(post_entity.user_entity),
            likeClicked=like_clicked)


class ResMainPost(BaseModel):

    class _Writer(BaseModel):
        idx: int
        id: str
        profileImage: str

        class Config:
            orm_mode = True

        @ staticmethod
        def toDTO(user_entity: UserEntity):
            return ResMainPost._Writer(
                idx=user_entity.idx,
                id=user_entity.id,
                profileImage=user_entity.profile_image
            )

    idx: int
    thumbnail: str | None
    title: str
    summary: str
    likeCount: int
    createDate: datetime
    writer: _Writer

    @ staticmethod
    def toDTO(post_entity: PostEntity):
        return ResMainPost(
            idx=post_entity.idx,
            thumbnail=post_entity.thumbnail,
            title=post_entity.title,
            summary=post_entity.summary,
            likeCount=len(
                list(filter(lambda like_entity: like_entity.delete_date == None,
                            post_entity.like_entity_list))
            ),
            createDate=post_entity.create_date,
            writer=ResMainPost._Writer.toDTO(post_entity.user_entity)
        )

    class Config:
        orm_mode = True


class ReqInsertPost(BaseModel):
    title: str
    summary: str
    content: str
    thumbnail: str | None


class ResInsertPost(BaseModel):
    idx: int

    class Config:
        orm_mode = True
