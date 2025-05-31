import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/index";
import Home from "../pages/Home";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
    //errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home/>
  },
]);

export default router;