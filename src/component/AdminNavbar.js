import React, { useEffect, useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as orderTypes from '../constants/order.constants';
import * as productTypes from '../constants/product.constants';
import SearchBox from "./SearchBox";

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

  const goMainProduct = () => {
    setSearchValue('')
    const prevMainSortBy = sessionStorage.getItem("prevMainSortBy");
    if(prevMainSortBy !== "") sessionStorage.removeItem("prevMainSortBy");
    dispatch({type:productTypes.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload:"popularity"});
    dispatch({type:productTypes.CHANGE_PAGE_OF_MAIN_PRODUCT, payload:1});
    navigate(mainProductPath);
  }

  const goAdminProduct = () => {
    setShow(false);
    setSearchValue('')
    setPlacehorder('상품명 검색')
    const prevAdminSortBy = sessionStorage.getItem("prevAdminSortBy");
    if(prevAdminSortBy !== "") sessionStorage.removeItem("prevAdminSortBy");
    dispatch({type:productTypes.SELECT_SORT_BY_ADMIN_PRODUCT_LIST, payload: "latest"});
    dispatch({type:productTypes.CHANGE_PAGE_OF_ADMIN_PRODUCT, payload:1});
    navigate(adminProductPath);
  };

  const goAdminOrder = () => {
    setShow(false);
    setSearchValue('')
    setPlacehorder('주문 번호 검색')
    dispatch({type:orderTypes.CHANGE_PAGE_OF_ORDER, payload:1});
    navigate(adminOrderPath);
  };

  const NavbarContent = () => {
    return (
      <div className="admin-side-navbar-content">
        <div onClick={() => goMainProduct()}>
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
        <ul className="side-navbar-area">
          <li
            className="admin-side-navbar-item"
            onClick={() => goAdminProduct()}
          >
            상품 관리
          </li>
          <li
            className="admin-side-navbar-item"
            onClick={() => goAdminOrder()}
          >
            주문 관리
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
          <div onClick={() => goMainProduct()}>
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
