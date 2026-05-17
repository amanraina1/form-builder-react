import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
// import FormsList from "../pages/FormsList";
// import FormBuilder from "../components/Builder/FormBuilder";
// import FormRenderer from "../components/Renderer/FormRenderer";
// import SubmissionsViewer from "../pages/SubmissionsViewer";
import LoginPage from "../components/Auth/LoginPage";
import RegisterPage from "../components/Auth/RegisterPage";
import { GuestOnly, RequireAuth } from "./guards";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //   {
      //     index: true,
      //     element: (
      //       <RequireAuth>
      //         <FormsList />
      //       </RequireAuth>
      //     ),
      //   },
      //   {
      //     path: "builder",
      //     element: (
      //       <RequireAuth>
      //         <FormBuilder />
      //       </RequireAuth>
      //     ),
      //   },
      //   {
      //     path: "builder/edit/:id",
      //     element: (
      //       <RequireAuth>
      //         <FormBuilder />
      //       </RequireAuth>
      //     ),
      //   },
      //   {
      //     path: "renderer/:id",
      //     element: <FormRenderer />,
      //   },
      //   { path: "renderer", element: <Navigate to="/" replace /> },
      //   {
      //     path: "submissions/:id",
      //     element: (
      //       <RequireAuth>
      //         <SubmissionsViewer />
      //       </RequireAuth>
      //     ),
      //   },
      {
        path: "login",
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: "register",
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
    ],
  },
]);
