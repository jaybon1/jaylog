import os

import uvicorn
from controller import post_controller, sign_controller
# 엔티티 연관관계 호출하기 전에 엔티티들 먼저 import 해줘야 함
# 해당 파일에서 사용하지 않더라도 import 해줘야 함
# 최상단 파일에서 import 하여 어디든 사용 가능하도록 함
from entity.like_entity import LikeEntity
from entity.post_entity import PostEntity
from entity.user_entity import UserEntity
from fastapi import FastAPI, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from middleware.jwt_middleware import JwtMiddleware

main_dir = os.path.dirname(__file__)

app = FastAPI()

templates = Jinja2Templates(directory=f"{main_dir}/templates")
app.mount(
    "/static", StaticFiles(directory=f"{main_dir}/static"), name="static")

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

app.add_middleware(JwtMiddleware)

app.include_router(sign_controller.router)
app.include_router(post_controller.router)


@app.get("/")
async def test(request: Request):
    return templates.TemplateResponse("test.html", {"request": request, "data": "템플릿 페이지"})


@app.post("/result")
async def test(idx: int = Form()):
    return {"idx": idx}

# app.router.redirect_slashes = False
if __name__ == "__main__":
    # TODO 로컬 배포
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    # TODO 실서버 배포
    # uvicorn.run("main:app", host="0.0.0.0", port=8000)
