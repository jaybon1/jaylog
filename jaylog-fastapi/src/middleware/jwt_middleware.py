import jwt
from config import constants
from dto import sign_dto
from fastapi import Request
from starlette.middleware.base import (BaseHTTPMiddleware,
                                       RequestResponseEndpoint)
from starlette.responses import Response


class JwtMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if 'authorization' in request.headers.keys():
            accessToken = request.headers.get(
                "authorization").replace("Bearer ", "")
            try:
                decodedJwt = jwt.decode(
                    accessToken, constants.JWT_SALT, algorithms=["HS256"])
                request.state.user = sign_dto.AccessJwt.toDTO(decodedJwt)
            except Exception as e:
                request.state.user = None
        else:
            request.state.user = None

        return await call_next(request)
