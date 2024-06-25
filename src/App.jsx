import "./styles/App.css";

import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppContext from "./AppContext.js";
import routes from "./routes.jsx";

function App() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:5000");
  const [authToken, setAuthToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const router = createBrowserRouter(routes);

  return (
    <AppContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        authToken,
        setAuthToken,
        loggedIn,
        setLoggedIn,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;
