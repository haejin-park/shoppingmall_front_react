import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage";
import AdminProduct from "../page/AdminProduct";
import CartPage from "../page/CartPage";
import Login from "../page/Login";
import MyPage from "../page/MyPage";
import OrderCompletePage from "../page/OrderCompletePage";
import PaymentPage from "../page/PaymentPage";
import ProductAll from "../page/ProductAll";
import ProductDetail from "../page/ProductDetail";
import RegisterPage from "../page/RegisterPage";
import PrivateRoute from "./PrivateRoute";

const AppRouter = ({user}) => {
  let location = useLocation();
  let navigate = useNavigate();
  // 
  useEffect(() => {
    if(user && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(-1); //이전 페이지 이동
    }
  }, [user, location.pathname, navigate]);
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route element={<PrivateRoute permissionLevel={user?.level === "customer"} />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel={user?.level === "admin"} />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
