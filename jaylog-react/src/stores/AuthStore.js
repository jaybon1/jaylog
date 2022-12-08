import jwtDecode from "jwt-decode";
import { action, makeObservable, observable } from "mobx";

export default class AuthStore {
  constructor() {
    this.setLoginUser(localStorage.getItem("accessToken"));
    makeObservable(this, {
      loginUser: observable,
      setLoginUser: action,
    });
  }

  setLoginUser = (content) => {
    localStorage.setItem("accessToken", content.accessToken);
    localStorage.setItem("refreshToken", content.refreshToken);
    try {
      this.loginUser = jwtDecode(content.accessToken);
    } catch (e) {
      this.loginUser = null;
    }
  };

  logout = (navigate) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.setLoginUser(null);
    navigate("/", { replace: true });
  };
}
