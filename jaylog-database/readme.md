# 데이터베이스 도커 순서

## 볼륨 확인

```
docker volume ls
```

## 볼륨 생성

```
docker volume create test_volume
```

## 이미지 생성

```
docker build -t 이미지이름 도커파일경로
```

## 컨테이너 실행

```
docker run -it --restart=always -d -p 3306:3306 -v test_volume:/var/lib/mysql --name 컨테이너이름 이미지이름
```
