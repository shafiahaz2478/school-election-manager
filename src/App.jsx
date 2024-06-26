import "./styles/App.css";
import { useCallback, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppContext from "./contexts/AppContext.js";
import { PositionsProvider } from "./contexts/PositionsContext.jsx";
import routes from "./routes.jsx";

function App() {
  const cachedBaseUrl = localStorage.getItem("baseUrl");

  const [baseUrl, setBaseUrl] = useState(
    cachedBaseUrl ? cachedBaseUrl : "http://localhost:3000",
  );
  const [authToken, setAuthToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [staffPassword, setStaffPassword] = useState("secret");

  const router = createBrowserRouter(routes);

  const checkAdminPresent = useCallback(async () => {
    const response = await fetch(`${baseUrl}/api/auth/users`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();

    if (data.error) {
      console.log(data.error);
    } else {
      for (const user of data.users) {
        if (user.username === "admin") {
          return;
        }
      }

      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          username: "admin",
          password: "secret",
          role: "admin",
        }),
      });
      const registerData = await registerResponse.json();

      if (registerData.error) {
        console.log(registerData.error);
      }
    }
  }, [baseUrl]);

  useEffect(() => {
    checkAdminPresent();
  }, [checkAdminPresent]);

  return (
    <AppContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        authToken,
        setAuthToken,
        loggedIn,
        setLoggedIn,
        staffPassword,
        setStaffPassword,
      }}
    >
      <PositionsProvider baseUrl={baseUrl}>
        <RouterProvider router={router} />
      </PositionsProvider>
    </AppContext.Provider>
  );
}

export default App;
