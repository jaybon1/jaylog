from pydantic import BaseModel

# TODO 클래스 명명법 등 DTO 설계 고민


class ReqSignUp(BaseModel):
    id: str
    password: str
    simpleDesc: str


class ResSignUp(BaseModel):
    idx: int

    class Config:
        orm_mode = True


class ReqSignIn(BaseModel):
    id: str
    password: str


class ResSignIn(BaseModel):
    accessToken: str
    refreshToken: str


class ReqRefresh(BaseModel):
    refreshToken: str


class ResRefresh(BaseModel):
    accessToken: str
    refreshToken: str


class AccessJwt(BaseModel):
    idx: int
    id: str
    simpleDesc: str
    profileImage: str
    role: str
    exp: int

    @staticmethod
    def toDTO(jwtDict: dict):
        return AccessJwt(
            idx=jwtDict["idx"],
            id=jwtDict["id"],
            simpleDesc=jwtDict["simpleDesc"],
            profileImage=jwtDict["profileImage"],
            role=jwtDict["role"],
            exp=jwtDict["exp"]
        )

    class Config:
        orm_mode = True


class RefreshJwt(BaseModel):
    idx: int
    exp: int

    @staticmethod
    def toDTO(jwtDict: dict):
        return RefreshJwt(
            idx=jwtDict["idx"],
            exp=jwtDict["exp"]
        )

    class Config:
        orm_mode = True
