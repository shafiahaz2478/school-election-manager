import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div>
      <h1>Error 404: Page not found</h1>
      <Link to="/">Go home</Link>
    </div>
  );
}
