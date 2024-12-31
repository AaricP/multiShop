import { Route, Routes } from "react-router-dom";
import ProductPage from "../pages/ProductPage";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import UpdateProduct from "../pages/UpdateProduct";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/:id" element={<UpdateProduct />} />
    </Routes>
  );
};
