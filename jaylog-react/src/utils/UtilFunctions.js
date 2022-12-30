import axios from "axios";
import jwtDecode from "jwt-decode";
import { customAxios } from "utils/CustomAxios";

export const requestPrivateInterceptor = async (config) => {
  // 통신 전 토큰 확인 및 전처리
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken == null || refreshToken == null) {
    throw new axios.Cancel("토큰이 없습니다.");
  }

  // accessToken이 만료되었는지 확인
  if (accessToken == null || jwtDecode(accessToken).exp < Date.now() / 1000) {
    // refreshToken이 만료되었는지 확인
    if (
      refreshToken == null ||
      jwtDecode(refreshToken).exp < Date.now() / 1000
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new axios.Cancel("토큰이 만료되었습니다.");
    } else {
      // refreshToken으로 accessToken 재발급
      const response = await customAxios.publicAxios({
        method: `post`,
        url: `/api/v1/sign/refresh`,
        data: {
          refreshToken: refreshToken,
        },
      });
      if (response?.status !== 200) {
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

export const responsePublicErrorHandler = (error) => {
  if (error.response == null) {
    alert("오류가 발생했습니다. 관리자에게 문의하세요.");
    console.log(error);
    return { status: -1 };
  }

  if (error.response.data?.detail != null) {
    alert(JSON.stringify(error.response.data.detail));
  } else if (error.response.data?.message != null) {
    alert(error.response.data.message);
  } else {
    alert("오류가 발생했습니다. 관리자에게 문의하세요.");
    console.log(error);
  }
  return { status: -1 };
};

export const responsePrivateErrorHandler = (error) => {
  if (error.response == null) {
    alert("오류가 발생했습니다. 관리자에게 문의하세요.");
    console.log(error);
    return { status: -1 };
  }
  if (error.response.status === 401) {
    customAxios
      .publicAxios({
        method: `post`,
        url: `/api/v1/sign/refresh`,
        data: {
          refreshToken: localStorage.getItem("refreshToken"),
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
          window.location.replace("/login");
        } else {
          const content = response.data.content;
          localStorage.setItem("accessToken", content.accessToken);
          localStorage.setItem("refreshToken", content.refreshToken);
          customAxios.privateAxios.request(error.config);
        }
      })
      .catch((error) => {
        alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
        window.location.replace("/login");
      });
    return { status: -1 };
  }

  if (error.response.data?.detail != null) {
    alert(JSON.stringify(error.response.data.detail));
  } else if (error.response.data?.message != null) {
    alert(error.response.data.message);
  } else {
    alert("오류가 발생했습니다. 관리자에게 문의하세요.");
    console.log(error);
  }
  return { status: -1 };
};
