import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadData = () => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
      }
    };
    loadData();
  }, []);

  const contextValue = {
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
