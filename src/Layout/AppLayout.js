import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import ToastMessage from "../component/ToastMessage";
import { userActions } from "../redux/actions/userAction";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if(storedToken) dispatch(userActions.loginWithToken());
  }, []);

  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
      <>
        <Navbar user={user} />
        {children}
      </>
      )}
    </div>
  );
};

export default AppLayout;

