import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import AdminOrder from "../page/AdminOrder";
import AdminProduct from "../page/AdminProduct";
import Cart from "../page/Cart";
import Login from "../page/Login";
import MyOrder from "../page/MyOrder";
import OrderComplete from "../page/OrderComplete";
import Payment from "../page/Payment";
import MainProduct from "../page/MainProduct";
import ProductDetail from "../page/ProductDetail";
import Register from "../page/Register";
import PrivateRoute from "./PrivateRoute";
import { useSelector } from "react-redux";

const AppRouter = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    if(user && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(-1); //이전 페이지 이동
    } 
  }, [user, location.pathname, navigate]);
  return (
    <Routes>
      <Route path="/" element={<MainProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route element={<PrivateRoute permissionLevel={user?.level === "customer"} />}>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order/complete" element={<OrderComplete />} />
        <Route path="/order" element={<MyOrder />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel={user?.level === "admin"} />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrder />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
