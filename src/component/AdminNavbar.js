import React, { useEffect, useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [windowSize, setWidnowSize] = useState(window.innerWidth <= 992);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

    useEffect(() => {
      const handleResize = () => {
        setWidnowSize(window.innerWidth <= 992);
        if (!windowSize && show) {
          setShow(false);
        }
      }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize, show]);

  const NavbarContent = () => {
    return (
      <div className="admin-side-navbar-content">
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
        <div className="admin-side-navbar-item">Admin Account</div>
        <ul className="side-navbar-area">
          <li
            className="admin-side-navbar-item"
            onClick={() => handleSelectMenu("/admin/product?page=1")}
          >
            product
          </li>
          <li
            className="admin-side-navbar-item"
            onClick={() => handleSelectMenu("/admin/order?page=1")}
          >
            order
          </li>
        </ul>
      </div>
    );
  };
  return (
    <>
      <div className="admin-side-navbar-box">{NavbarContent()}</div>
      <Navbar bg="light" expand={false} className="admin-side-navbar-toggle">
        <Container fluid>
          <Link to="/">
            <img width={80} src="/image/hm-logo.png" alt="hm-logo.png" />
          </Link>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(!show)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="admin-side-navbar"
            show={show}
            onHide={() => setShow(false)}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
