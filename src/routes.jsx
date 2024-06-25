import Admin from "./pages/Admin";
import Election from "./pages/Election";
import Home from "./pages/Home";
import ErrorElement from "./components/ErrorElement";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorElement />,
  },
  {
    path: "admin",
    element: <Admin />,
    errorElement: <ErrorElement />,
  },
  {
    path: "vote",
    element: <Election />,
    errorElement: <ErrorElement />,
  },
];

export default routes;
