import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Classroom from "../pages/Classroom";
const ideduRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/classroom",
    element: <Classroom />,
  },
]);

export const IDEduRouter = () => <RouterProvider router={ideduRouter} />;
