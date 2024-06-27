import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function PageNotFound() {
  return (
    <Container
      child={
        <div className="container">
          <h1>Error 404: Page not found</h1>
          <Link to="/">Go home</Link>
        </div>
      }
    />
  );
}
