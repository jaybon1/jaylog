FROM python:3.10.7

# 컨테이너 실행 전 작동할 명령
# RUN (명령)
# 타임존 설정 (설정을 하지 않으면 시간 저장시 다른 시간대로 저장됨)
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo Asia/Seoul > /etc/timezone

WORKDIR /app

# COPY ./requirements.txt /app/
COPY . .

RUN pip install -r requirements.txt

CMD uvicorn --host=0.0.0.0 --port=8080 파일경로:app