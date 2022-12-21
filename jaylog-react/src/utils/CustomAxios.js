import axios from "axios";
import jwtDecode from "jwt-decode";
import { BASE_URL } from "config/Constants";

class CustomAxios {
  static _instance = new CustomAxios();
  static instance = () => {
    return CustomAxios._instance;
  };
  constructor() {
    this.publicAxios = axios.create({ baseURL: BASE_URL });
    this.privateAxios = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    });
    this.privateAxios.interceptors.request.use(this._requestPrivateInterceptor);
  }

  _requestPrivateInterceptor = async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken == null || refreshToken == null) {
      throw new axios.Cancel("토큰이 없습니다.");
    }

    // accessToken이 만료되었는지 확인
    if (accessToken == null || jwtDecode(accessToken).exp < Date.now() / 1000) {
      // refreshToken이 만료되었는지 확인
      if (refreshToken && jwtDecode(refreshToken).exp < Date.now() / 1000) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw new axios.Cancel("토큰이 만료되었습니다.");
      } else {
        // refreshToken으로 accessToken 재발급
        const response = await this.publicAxios({
          method: `post`,
          url: `/api/v1/sign/refresh`,
          data: {
            refreshToken: refreshToken,
          },
        });
        if (response.status !== 200) {
          throw new axios.Cancel("토큰이 만료되었습니다.");
        }
        const content = response.data.content;
        localStorage.setItem("accessToken", content.accessToken);
        localStorage.setItem("refreshToken", content.refreshToken);
        config.headers["Authorization"] = `Bearer ${content.accessToken}`;
      }
    } else {
      // accessToken이 만료되지 않았다면
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  };
}

export const customAxios = CustomAxios.instance();
