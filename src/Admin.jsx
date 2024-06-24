import { Link } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Positions from "./components/Positions";

import "./Admin.css";
import Sessions from "./components/Sessions";

export default function Admin() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:5000/api");
  const [authToken, setAuthToken] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (token) => {
    setAuthToken(token);
    setLoggedIn(true);
  };

  return (
    <div id="base">
      <header>
        <h1>Administration Page</h1>
      </header>
      <div>
        {loggedIn ? (
          <div>
            <div>
              <h3>Backend URL</h3>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <Positions baseUrl={baseUrl} authToken={authToken} />
            <Sessions baseUrl={baseUrl} authToken={authToken} />
          </div>
        ) : isRegistering ? (
          <div>
            <Register baseUrl={baseUrl} onLogin={handleLogin} />
            <a onClick={() => setIsRegistering(false)}>
              Already have an account? Log in!
            </a>
          </div>
        ) : (
          <div>
            <Login baseUrl={baseUrl} onLogin={handleLogin} />
            <a onClick={() => setIsRegistering(true)}>
              No user account? Create one!
            </a>
          </div>
        )}
      </div>
      <footer>
        <Link to="/">Go back</Link>
      </footer>
    </div>
  );
}
