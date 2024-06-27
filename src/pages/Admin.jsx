import { useContext } from "react";

import Login from "../components/Login";
// import Register from "../components/Register";
import Positions from "../components/Positions";
import Results from "../components/Results";

import "../styles/Admin.css";
import AppContext from "../contexts/AppContext";
import Container from "../components/Container";

export default function Admin() {
  // const [isRegistering, setIsRegistering] = useState(false);

  const { loggedIn, setLoggedIn, setAuthToken } = useContext(AppContext);

  const handleLogin = (token) => {
    setAuthToken(token);
    setLoggedIn(true);
  };

  return (
    <Container
      child={
        <div className="container admin">
          <h1 className="container-title">Administration Page</h1>
          <div>
            {loggedIn ? (
              <div>
                <Positions />
                <Results />
              </div>
            ) : (
              <div>
                <Login onLogin={handleLogin} />
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
