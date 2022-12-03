from pydantic import BaseModel

# TODO 클래스 명명법 등 DTO 설계 고민


class Req(BaseModel):
    id: str
    password: str
    simpleDesc: str


class Res(BaseModel):
    idx: int

    class Config:
        orm_mode = True
