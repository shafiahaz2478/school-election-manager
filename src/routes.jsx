import Admin from "./pages/Admin";
import Vote from "./pages/Vote";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
  {
    path: "vote",
    element: <Vote />,
  },
];

export default routes;
