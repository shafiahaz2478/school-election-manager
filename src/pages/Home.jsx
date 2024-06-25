import { Link } from "react-router-dom";

import Header from "../components/Header";
import BackendConnection from "../components/BackendConnection.jsx";

export default function Home() {
  return (
    <div>
      <Header />
      <BackendConnection />
      <Link to="admin" className="link">
        Admin Portal
      </Link>
      <Link to="vote" className="link">
        Voting Portal
      </Link>
    </div>
  );
}
