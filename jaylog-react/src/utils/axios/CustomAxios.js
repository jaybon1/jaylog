import axios from "axios";

class CustomAxios {
  static _instance = new CustomAxios();
  constructor() {
    this.loginAxios = axios.create();
  }
  static instance = () => {
    return CustomAxios._instance;
  };
}

export default CustomAxios.instance();
