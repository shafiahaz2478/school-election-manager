import { Link } from "react-router-dom";

export default function Links() {
  return (
    <>
      <Link to="admin" className="link">
        Admin Portal
      </Link>
      <Link to="vote" className="link">
        Voting Portal
      </Link>
    </>
  );
}
