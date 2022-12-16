from pydantic import BaseModel
from datetime import datetime
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity


class _DetailPostWriter(BaseModel):
    idx: int
    id: str
    profileImage: str

    @staticmethod
    def toDTO(userEntity: UserEntity):
        return _DetailPostWriter(
            idx=userEntity.idx,
            id=userEntity.id,
            profileImage=userEntity.profile_image
        )


class ResDetailPost(BaseModel):
    idx: int
    title: str
    content: str
    likeCount: int
    createDate: datetime
    writer: _DetailPostWriter
    
    @staticmethod
    def toDTO(postEntity: PostEntity):
        return ResDetailPost(
            idx=postEntity.idx,
            title=postEntity.title,
            content=postEntity.content,
            likeCount=len(postEntity.likeEntitys),
            createDate=postEntity.create_date,
            writer=_DetailPostWriter.toDTO(postEntity.userEntity)
        )


class _MainPostWriter(BaseModel):
    idx: int
    id: str
    profileImage: str

    @staticmethod
    def toDTO(userEntity: UserEntity):
        return _MainPostWriter(
            idx=userEntity.idx,
            id=userEntity.id,
            profileImage=userEntity.profile_image
        )


class ResMainPost(BaseModel):
    idx: int
    thumbnail: str | None
    title: str
    summary: str
    likeCount: int
    createDate: datetime
    writer: _MainPostWriter

    @staticmethod
    def toDTO(postEntity: PostEntity):
        return ResMainPost(
            idx=postEntity.idx,
            thumbnail=postEntity.thumbnail,
            title=postEntity.title,
            summary=postEntity.summary,
            likeCount=len(postEntity.likeEntitys),
            createDate=postEntity.create_date,
            writer=_MainPostWriter.toDTO(postEntity.userEntity)
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
