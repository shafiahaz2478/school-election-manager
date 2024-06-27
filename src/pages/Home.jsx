import { Link } from "react-router-dom";

import "../styles/Home.css";

import BackendConnection from "../components/BackendConnection.jsx";
import Container from "../components/Container.jsx";

export default function Home() {
  return (
    <Container
      child={
        <div className="container home">
          <div className="links">
            <Link to="vote" className="link vote">
              Voting Portal
            </Link>
            <Link to="admin" className="link admin">
              Admin Portal
            </Link>
          </div>
          <BackendConnection />
        </div>
      }
    />
  );
}
