from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 엔티티 연관관계 호출하기 전에 엔티티들 먼저 import 해줘야 함
# 해당 파일에서 사용하지 않더라도 import 해줘야 함
# 최상단 파일에서 import 하여 어디든 사용 가능하도록 함
from entity.like_entity import LikeEntity
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity

from controller import (join_controller, login_controller,
                        post_controller)
from util import functions

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(join_controller.router)
app.include_router(login_controller.router)
app.include_router(post_controller.router)


@app.get("/")
async def test(request: Request):
    print(request.headers.get('Authorization'))
    return functions.res_generator(content=request.headers.get('Authorization'))

# app.router.redirect_slashes = False
if __name__ == "__main__":
    # TODO 로컬 배포
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    # TODO 실서버 배포
    # uvicorn.run("main:app", host="0.0.0.0", port=8000)
