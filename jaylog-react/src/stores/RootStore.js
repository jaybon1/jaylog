import { createContext, useContext } from "react";
import AuthStore from "stores/AuthStore";

const Stores = class {
  constructor() {
    this.authStore = new AuthStore();
  }
};

const StoreContext = createContext(new Stores());

export const StoreProvider = ({ children }) => {
  return <StoreContext.Provider>{children}</StoreContext.Provider>;
};

export const useAuthStore = () => useContext(StoreContext).authStore;
