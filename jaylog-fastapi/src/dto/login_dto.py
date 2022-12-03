from pydantic import BaseModel
from datetime import datetime


class Req(BaseModel):
    id: str
    password: str


class Res(BaseModel):
    accessToken: str
    refreshToken: str


class Jwt(BaseModel):
    idx: int
    id: str
    simpleDesc: str
    profileImage: str
    role: str
    exp: datetime

    class Config:
        orm_mode = True
