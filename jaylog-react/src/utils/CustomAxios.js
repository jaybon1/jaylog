import axios from "axios";
import { BASE_URL } from "config/Constants";
import {
  requestPrivateInterceptor,
  responsePrivateErrorHandler,
  responsePublicErrorHandler,
} from "utils/UtilFunctions";

class CustomAxios {
  static _instance = new CustomAxios();
  static instance = () => {
    return CustomAxios._instance;
  };
  constructor() {
    this.publicAxios = axios.create({ baseURL: BASE_URL });
    this.publicAxios.interceptors.response.use(
      (response) => response,
      responsePublicErrorHandler
    );

    this.privateAxios = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    });
    this.privateAxios.interceptors.request.use(requestPrivateInterceptor);
    this.privateAxios.interceptors.response.use(
      (response) => response,
      responsePrivateErrorHandler
    );
  }
}

export const customAxios = CustomAxios.instance();
