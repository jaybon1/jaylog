import jwtDecode from "jwt-decode";
import { action, makeObservable, observable } from "mobx";

export default class AuthStore {
  constructor() {
    this.loginUser = null;
    makeObservable(this, {
      loginUser: observable,
      setLoginUser: action,
    });
  }

  setLoginUser = (content) => {
    try {
      this.loginUser = jwtDecode(content.accessToken);
    } catch (e) {
      this.loginUser = null;
    }
  };

  logout = (navigate) => {
    this.setLoginUser(null);
    navigate("/", { replace: true });
  };
}
