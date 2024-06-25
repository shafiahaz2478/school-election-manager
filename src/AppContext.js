import { createContext } from "react";

const AppContext = createContext({
  baseUrl: "",
  setBaseUrl: () => {},
});

export default AppContext;
