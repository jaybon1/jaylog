import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
import jwt

from util import functions


class JwtMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if '/api/' not in request.url:
            return await call_next(request)
        if 'Authorization' not in request.headers.keys():
            functions.res_generator(status_code=401, error_dict={
                                    "code": 0, "message": "accessToken need"})
        accessToken = request.headers.get(
            "Authorization").replace("Bearer ", "")
        try:
            decodedJwt = jwt.decode(accessToken, "비밀소금", algorithms=["HS256"])
        except Exception as e:
            print(e)
            return functions.res_generator(status_code=401, error_dict={
                "code": 0, "message": "accessToken invalid"})
        request.state.user = decodedJwt
        return await call_next(request)
