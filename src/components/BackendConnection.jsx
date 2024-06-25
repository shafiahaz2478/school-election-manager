import { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import AppContext from "../AppContext.js";

export default function BackendConnection() {
  const { baseUrl, setBaseUrl } = useContext(AppContext);

  const [connectionUrl, setConnectionUrl] = useState(baseUrl);

  const handleNewConnection = (e) => {
    e.preventDefault();
    setBaseUrl(connectionUrl);

    const socket = io(connectionUrl);

    socket.on("connect", () => {
      console.log(`Connected to WebSocket server: ${connectionUrl}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  };

  const handleNewConnectionCallback = useCallback(handleNewConnection, [
    connectionUrl,
    setBaseUrl,
  ]);
  useEffect(() => {
    handleNewConnectionCallback(new Event("submit"));
  }, [handleNewConnectionCallback]);

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
