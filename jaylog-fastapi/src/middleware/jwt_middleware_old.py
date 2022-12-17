import jwt
from config import constants
from dto import sign_dto
from fastapi import Request
from starlette.middleware.base import (BaseHTTPMiddleware,
                                       RequestResponseEndpoint)
from starlette.responses import Response
from util import functions


class JwtMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if '/private/' not in str(request.url.path):
            return await call_next(request)
        # 헤더 키값이 모두 소문자로 변경됨
        if 'authorization' not in request.headers.keys():
            return functions.res_generator(status_code=401, error_dict={
                "code": 0, "message": "authorization : empty"})
        accessToken = request.headers.get(
            "authorization").replace("Bearer ", "")
        try:
            decodedJwt = jwt.decode(
                accessToken, constants.JWT_SALT, algorithms=["HS256"])
        except Exception as e:
            return functions.res_generator(status_code=401, error_dict={
                "code": 0, "message": f"authorization : {str(e)}"})
        request.state.jwt_user = sign_dto.AccessJwt.toDTO(decodedJwt)
        return await call_next(request)
