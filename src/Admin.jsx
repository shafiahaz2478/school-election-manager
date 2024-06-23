import { Link } from "react-router-dom";
import Login from "./components/Login";

import "./Admin.css";
import { useState } from "react";
import Register from "./components/Register";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authToken, setAuthToken] = useState(null);

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
          <p>You are logged in.</p>
        ) : isRegistering ? (
          <div>
            <Register onLogin={handleLogin} />
            <a onClick={() => setIsRegistering(false)}>
              Already have an account? Log in!
            </a>
          </div>
        ) : (
          <div>
            <Login onLogin={handleLogin} />
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
