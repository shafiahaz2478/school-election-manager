import App from "./App";
import Admin from "./Admin";
import Vote from "./Vote";
import Links from "./components/Links";
import PageNotFound from "./PageNotFound";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Links /> },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "vote",
        element: <Vote />,
      },
    ],
    errorElement: <PageNotFound />,
  },
];

export default routes;
