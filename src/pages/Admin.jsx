import { Link } from "react-router-dom";
import { useState } from "react";

import Login from "../components/Login";
import Register from "../components/Register";
import Positions from "../components/Positions";

import "../styles/Admin.css";
import Sessions from "../components/Sessions";
import Header from "../components/Header";

export default function Admin() {
  const [authToken, setAuthToken] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (token) => {
    setAuthToken(token);
    setLoggedIn(true);
  };

  return (
    <div>
      <Header />
      <header>
        <h1>Administration Page</h1>
      </header>
      <div>
        {loggedIn ? (
          <div>
            <Positions authToken={authToken} />
            <Sessions authToken={authToken} />
          </div>
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
