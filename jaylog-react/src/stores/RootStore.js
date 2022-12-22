import { createContext, useContext } from "react";
import AuthStore from "stores/AuthStore";
import UrlStore from "stores/UrlStore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider
      value={{
        authStore: AuthStore(),
        urlStore: UrlStore(),
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
/** @type {AuthStore()} useAuthStore */
export const useAuthStore = () => useContext(StoreContext).authStore;
/** @type {UrlStore()} useUrlStore */
export const useUrlStore = () => useContext(StoreContext).urlStore;
