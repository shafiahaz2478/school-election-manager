import { Link } from "react-router-dom";
import { useContext } from "react";

import Header from "../components/Header";
import AppContext from "../AppContext.js";

export default function Home() {
  const { baseUrl, setBaseUrl } = useContext(AppContext);

  return (
    <div>
      <Header />
      <div>
        <h3>Backend URL</h3>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>
      <Link to="admin" className="link">
        Admin Portal
      </Link>
      <Link to="vote" className="link">
        Voting Portal
      </Link>
    </div>
  );
}
