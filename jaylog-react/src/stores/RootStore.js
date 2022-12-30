import { createContext, useContext } from "react";
import AuthStore from "stores/AuthStore";
import UrlStore from "stores/UrlStore";
import SearchStore from "stores/SearchStore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider
      value={{
        authStore: AuthStore(),
        urlStore: UrlStore(),
        searchStore: SearchStore(),
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
/** @type {SearchStore()} useSearchStore */
export const useSearchStore = () => useContext(StoreContext).searchStore;
