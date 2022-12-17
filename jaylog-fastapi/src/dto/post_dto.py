from pydantic import BaseModel
from datetime import datetime
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity


class ResLikePost(BaseModel):
    likeCount: int

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
        def toDTO(userEntity: UserEntity):
            return ResDetailPost._Writer(
                idx=userEntity.idx,
                id=userEntity.id,
                profileImage=userEntity.profile_image
            )

    idx: int
    title: str
    content: str
    likeCount: int
    createDate: datetime
    writer: _Writer

    class Config:
        orm_mode = True

    @staticmethod
    def toDTO(postEntity: PostEntity):
        return ResDetailPost(
            idx=postEntity.idx,
            title=postEntity.title,
            content=postEntity.content,
            likeCount=len(postEntity.like_entity_list),
            createDate=postEntity.create_date,
            writer=ResDetailPost._Writer.toDTO(postEntity.user_entity))


class ResMainPost(BaseModel):

    class _Writer(BaseModel):
        idx: int
        id: str
        profileImage: str

        class Config:
            orm_mode = True

        @staticmethod
        def toDTO(userEntity: UserEntity):
            return ResMainPost._Writer(
                idx=userEntity.idx,
                id=userEntity.id,
                profileImage=userEntity.profile_image
            )

    idx: int
    thumbnail: str | None
    title: str
    summary: str
    likeCount: int
    createDate: datetime
    writer: _Writer

    @staticmethod
    def toDTO(postEntity: PostEntity):
        return ResMainPost(
            idx=postEntity.idx,
            thumbnail=postEntity.thumbnail,
            title=postEntity.title,
            summary=postEntity.summary,
            likeCount=len(postEntity.like_entity_list),
            createDate=postEntity.create_date,
            writer=ResMainPost._Writer.toDTO(postEntity.user_entity)
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
