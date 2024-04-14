import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigationType } from "react-router";
import AdminNavbar from "../component/AdminNavbar";
import Navbar from "../component/Navbar";
import ToastMessage from "../component/ToastMessage";
import * as productTypes from '../constants/product.constants';
import { userActions } from "../redux/actions/userAction";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const storedToken = sessionStorage.getItem('token');
  const navigationType = useNavigationType();
  const mainProductPath = '/';
  const adminProductPath = '/admin/product';

  useEffect(() => {
    if(storedToken) dispatch(userActions.loginWithToken(user));
  }, [storedToken, dispatch]);

  useEffect(() => {
    if(navigationType === "POP") {
      let sortBy = ''
      if(location.pathname === mainProductPath) {
        sortBy = sessionStorage.getItem("prevMainSortBy");
        dispatch({type:productTypes.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload: sortBy});
      } else if(adminProductPath) {
        sortBy = sessionStorage.getItem("prevAdminSortBy");
        dispatch({type:productTypes.SELECT_SORT_BY_ADMIN_PRODUCT_LIST, payload: sortBy});
      }
    } 
  }, [navigationType, location, dispatch]);

  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <div className="admin-navbar-row">
          <div className="admin-navbar-col">
            <AdminNavbar />
          </div>
          <div className="admin-children-col">
            {children}
          </div>
        </div>
      ) : (
      <>
        <Navbar/>
        {children}
      </>
      )}
    </div>
  );
};

export default AppLayout;

