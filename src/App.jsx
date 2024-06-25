import "./styles/App.css";

import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppContext from "./AppContext.js";
import routes from "./routes.jsx";

function App() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:5000/api");

  const router = createBrowserRouter(routes);

  return (
    <AppContext.Provider value={{ baseUrl, setBaseUrl }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;
