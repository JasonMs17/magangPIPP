import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import routes from "./config";
import PrivateRoute from "./PrivateRoute";
import { Styles } from "../styles/styles";

const Router = () => {
  return (
  <Suspense
  fallback={
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  }
>

      <Styles />
      <Header />
      <Routes>
        {routes.map(({ path, component, isPrivate }) => {
          const Component = lazy(() => import(`../pages/${component}`));

          return isPrivate ? (
            <Route key={path} element={<PrivateRoute />}>
              <Route path={path} element={<Component />} />
            </Route>
          ) : (
            <Route key={path} path={path} element={<Component />} />
          );
        })}

        {/* Redirect semua path yang tidak dikenal ke halaman utama */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
