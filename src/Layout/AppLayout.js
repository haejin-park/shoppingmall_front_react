import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import AdminNavbar from "../component/AdminNavbar";
import Navbar from "../component/Navbar";
import ToastMessage from "../component/ToastMessage";
import { userActions } from "../redux/actions/userAction";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if(storedToken) dispatch(userActions.loginWithToken());
  }, [dispatch]);

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
        <Navbar />
        {children}
      </>
      )}
    </div>
  );
};

export default AppLayout;

