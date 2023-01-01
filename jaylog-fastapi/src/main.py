import os

import uvicorn
from controller import sign_controller, post_controller, user_controller
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

# 실행경로가 다르더라도 스태틱 파일 경로를 찾기 위해 사용
main_dir = os.path.dirname(__file__)

app = FastAPI()

# 템플릿과 스태틱 파일 가져오기
templates = Jinja2Templates(directory=f"{main_dir}/templates")
app.mount(
    "/static", StaticFiles(directory=f"{main_dir}/static"), name="static")


# cors 설정 미들웨어
origins = ["http://localhost:3000", "http://52.78.101.85"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # true 설정시 origins ["*"] 불가 / 프론트가 웹일 경우는 true, 앱일 경우는 false 설정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jwt 설정 미들웨어
app.add_middleware(JwtMiddleware)

# 컨트롤러 설정
app.include_router(sign_controller.router)
app.include_router(post_controller.router)
app.include_router(user_controller.router)


# 테스트 템플릿
@app.get("/")
async def test(request: Request):
    return templates.TemplateResponse("test.html", {"request": request, "data": "템플릿 페이지"})


# 템플릿 form 요청 처리
@app.post("/result")
async def test(idx: int = Form()):
    return {"idx": idx}

if __name__ == "__main__":
    # TODO 로컬 배포
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    # TODO 실서버 배포
    # uvicorn.run("main:app", host="0.0.0.0", port=8000)
