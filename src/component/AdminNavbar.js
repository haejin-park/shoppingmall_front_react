import React, { useEffect, useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminOrderActions } from "../redux/actions/adminOrderAction";
import { adminProductActions } from "../redux/actions/adminProductAction";
import { mainProductActions } from "../redux/actions/mainProductAction";
import SearchBox from "./SearchBox";
import { cartActions } from "../redux/actions/cartAction";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [tabletSize, setTabletwSize] = useState(window.innerWidth <= 992);
  const [searchValue, setSearchValue] = useState("");
  const [placeholder, setPlacehorder] = useState('상품명 검색');
  const adminOrderPath ='/admin/order';
  const adminProductPath = '/admin/product';
  const mainProductPath = '/';


  useEffect(() => {
    const handleResize = () => {
      setTabletwSize(window.innerWidth <= 992);
      if (!tabletSize && show) {
        setShow(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [tabletSize, show]);

  const goMainProduct = (firstPage) => {
    setSearchValue('')
    dispatch(mainProductActions.changePage(firstPage));
    navigate(`${mainProductPath}?currentPage=${firstPage}`);
  }

  const goAdminProduct = (firstPage) => {
    setShow(false);
    setSearchValue('')
    setPlacehorder('상품명 검색')
    dispatch(adminProductActions.changePage(firstPage));
    navigate(`${adminProductPath}?currentPage=${firstPage}`);
  };

  const goAdminOrder = (firstPage) => {
    setShow(false);
    setSearchValue('')
    setPlacehorder('주문 번호 검색')
    dispatch(adminOrderActions.changePage(firstPage));
    navigate(`${adminOrderPath}?currentPage=${firstPage}`);
  };

  const NavbarContent = () => {
    return (
      <div className="admin-side-navbar-content">
        <div onClick={() => goMainProduct(1)}>
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </div>
        <div className="mt-2 admin-search-box">
          <SearchBox 
            placeholder={placeholder}
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
            show={show}
          />
        </div>
        <div className="admin-side-navbar-item">Admin Account</div>
        <ul className="side-navbar-area">
          <li
            className="admin-side-navbar-item"
            onClick={() => goAdminProduct(1)}
          >
            product
          </li>
          <li
            className="admin-side-navbar-item"
            onClick={() => goAdminOrder(1)}
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
          <div onClick={() => goMainProduct(1)}>
            <img width={80} src="/image/hm-logo.png" alt="hm-logo.png" />
          </div>
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
            <Offcanvas.Header closeButton className="d-flex justify-content-end"></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
