import { useRoutes } from "react-router-dom";
import MainLayout from "./components/MainLayout/Index";
import { Home } from "./pages/Home";

function Router() {
  const routes = [
    {
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        //{ path: "/contact", element: <Contact /> },
      ],
    },
  ];
  return useRoutes(routes);
}

export default Router;
