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
    exp: int

    @staticmethod
    def toDTO(jwtDict: dict):
        return Jwt(
            idx=jwtDict["idx"],
            id=jwtDict["id"],
            simpleDesc=jwtDict["simpleDesc"],
            profileImage=jwtDict["profileImage"],
            role=jwtDict["role"],
            exp=jwtDict["exp"]
        )

    class Config:
        orm_mode = True
