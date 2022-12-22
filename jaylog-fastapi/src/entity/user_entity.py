
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from database.database import DBase


class UserEntity(DBase):
    __tablename__ = "User"

    idx = Column(Integer, primary_key=True, index=True)
    id = Column(String, unique=True, index=True)
    password = Column(String)
    simple_desc = Column(String, default="한 줄 소개가 없습니다.")
    profile_image = Column(
        String, default="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
    role = Column(String, default="BLOGER")
    create_date = Column(DateTime, default=datetime.now)
    update_date = Column(DateTime)
    delete_date = Column(DateTime)

    post_entity_list = relationship("PostEntity", back_populates="user_entity")

    like_entity_list = relationship("LikeEntity", back_populates="user_entity")
