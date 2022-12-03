from pydantic import BaseModel


class Req(BaseModel):
    id: str
    password: str
    simpleDesc: str


class Res(BaseModel):
    idx: int

    class Config:
        orm_mode = True
