import { Link } from "react-router-dom";
import Login from "./components/Login";

import "./Admin.css";
import { useState } from "react";
import Register from "./components/Register";

const baseUrl = "http://localhost:5000/api";

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
          <div>
            <Positions baseUrl={baseUrl} authToken={authToken} />
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

function Positions({ baseUrl, authToken }) {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${baseUrl}/positions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setPositions(data.positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  fetchPositions();

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/positions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: newPosition }),
      });
      const data = await response.json();
      alert(data.message || data.error);
      setPositions([...positions, data.position]);
      setNewPosition("");
      fetchPositions();
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  const handleRemovePosition = async (positionId) => {
    try {
      const response = await fetch(`${baseUrl}/positions/${positionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      alert(data.message || data.error);
      fetchPositions();
    } catch (error) {
      console.error("Error removing position:", error);
    }
  };

  return (
    <div>
      <h3>Positions</h3>
      <ol>
        {positions.map((position) => (
          <span key={position._id}>
            <li>{position.name}</li>
            <button onClick={() => handleRemovePosition(position._id)}>
              Remove
            </button>
          </span>
        ))}
      </ol>
      <form onSubmit={handleAddPosition}>
        <input
          type="text"
          placeholder="Position"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          required
        />
        <button type="submit">Add Position</button>
      </form>
    </div>
  );
}
