import AuthMiddleware from "./components/auth-middleware";

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import AppPage from "@/pages/app";
import HomePage from "@/pages/home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<AuthMiddleware redirectTo="/app" redirectWhen="authenticated" />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="app">
        <Route element={<AuthMiddleware redirectTo="/" redirectWhen="unauthenticated" />}>
          <Route index element={<AppPage />} />
        </Route>
      </Route>
    </Route>,
  ),
);

const Router = () => {
  return <RouterProvider router={router} />;
};
export default Router;
