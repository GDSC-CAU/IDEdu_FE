import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Classroom from "../pages/Classroom";
import StudentIDE from "../pages/StudentIDE";
import TeacherIDE from "../pages/TeacherIDE";
import Dashboard from "../pages/Dashboard";

const ideduRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/classroom",
    element: <Classroom />,
  },
  {
    path: "/dashboard/:userId",
    element: <Dashboard />,
  },
  {
    path: "/student-ide",
    element: <StudentIDE />,
  },
  {
    path: "/teacher-ide",
    element: <TeacherIDE />,
  },
]);

export const IDEduRouter = () => <RouterProvider router={ideduRouter} />;
