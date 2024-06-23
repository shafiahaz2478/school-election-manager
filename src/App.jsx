import "./App.css";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <header className="school">
        <img src="/gps.png" alt="GPS Logo" className="logo" />
        <h1>Greenwoods Public School</h1>
      </header>
      <h2>Prefectorial Board Election</h2>
      <Outlet />
    </div>
  );
}

export default App;
