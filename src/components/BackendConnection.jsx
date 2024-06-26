import { useContext, useState } from "react";

import AppContext from "../contexts/AppContext.js";

export default function BackendConnection() {
  const { baseUrl, setBaseUrl } = useContext(AppContext);

  const [connectionUrl, setConnectionUrl] = useState(baseUrl);

  const handleNewConnection = (e) => {
    e.preventDefault();
    setBaseUrl(connectionUrl);
    localStorage.setItem("baseUrl", connectionUrl);
  };

  return (
    <div>
      <h3>Backend URL</h3>
      <form onSubmit={handleNewConnection}>
        <input
          type="text"
          value={connectionUrl}
          onChange={(e) => setConnectionUrl(e.target.value)}
        />
        <button type="submit">Connect</button>
      </form>
      <p>Connected to backend server at {baseUrl}</p>
    </div>
  );
}
