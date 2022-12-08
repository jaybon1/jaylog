from pydantic import BaseModel
from datetime import datetime
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity


class _PostUser(BaseModel):
    idx: int
    id: str
    profileImage: str

    @staticmethod
    def toDTO(userEntity: UserEntity):
        return _PostUser(
            idx=userEntity.idx,
            id=userEntity.id,
            profileImage=userEntity.profile_image
        )


class ResPost(BaseModel):
    idx: int
    thumbnail: str | None
    title: str
    summary: str
    likeCount: int
    createDate: datetime
    user: _PostUser

    @staticmethod
    def toDTO(postEntity: PostEntity):
        return ResPost(
            idx=postEntity.idx,
            thumbnail=postEntity.thumbnail,
            title=postEntity.title,
            summary=postEntity.summary,
            likeCount=len(postEntity.likeEntitys),
            createDate=postEntity.create_date,
            user=_PostUser.toDTO(postEntity.userEntity)
        )

    class Config:
        orm_mode = True
