
import {
  faBars,
  faBox,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faShoppingBag,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userActions } from "../redux/actions/userAction";
import SearchBox from "./SearchBox";

const Navbar = ({ user }) => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  let [loginStatus, setLoginStatus] = useState(true);
  useEffect(() => {
    if(!user && (location.pathname === '/login' || location.pathname === '/register')) {
      setLoginStatus(false);
    } else {
      setLoginStatus(true);
    }
  }, [user, location.pathname]);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];
  let [width, setWidth] = useState(0);
  let [overlayStatus, setOverlayStatus] = useState(false);
  const logout = () => {
    dispatch(userActions.logout());  
  };
  const handleOpen = (width) => {
    setWidth(width);
    setOverlayStatus(true)
  }

  const handlClose = () => {
    setWidth(0);
    setOverlayStatus(false)
  }

  useEffect(() => {
    const handleEscapeKeyPress = (event) => {
      if (event.key === 'Escape') handlClose();
    };
    document.addEventListener('keydown', handleEscapeKeyPress);
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []); 
  
  return (
    <div>
      {loginStatus && ( 
        <div>
          <div className="side-menu" style={{ width }}>
            <button className="closebtn" onClick={() => handlClose()}>
              &times;
            </button>
            <div className="mt-2 main-search-box">
              <SearchBox placeholder="상품명 검색" field="name"/>
            </div>
            <div className="side-menu-list" id="menu-list">
              {menuList.map((menu, index) => (
                <button key={index}>{menu}</button>
              ))}
            </div>
          </div>
          <div className={`overlay ${overlayStatus ? 'overlay-show' : ''}`}></div>
          <div className="nav-header">
            <div className="burger-menu">
              <FontAwesomeIcon icon={faBars} onClick={() => handleOpen(250)} />
            </div>
            <div>
              <div className="display-flex">
                <div className="nav-function" onClick={() => handleOpen(250)}>
                  <FontAwesomeIcon icon={faSearch} />
                  {!isMobile && (
                      <span style={{ cursor: "pointer" }}>상품 검색</span>
                  )}
                </div>
                {user && user.level === "admin" && (
                  <div onClick={() => navigate("/admin/product?page=1")} className="nav-function">
                    <FontAwesomeIcon icon={faUser} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>관리자</span>
                    )}
                  </div>
                )}
                {user ? 
                  <div onClick={logout} className="nav-function">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>로그아웃</span>
                    )}
                  </div>
                  : 
                  <div onClick={() => navigate("/login")} className="nav-function">
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
                  </div>
                }             
                <div onClick={() => navigate("/cart")} className="nav-function">
                  <FontAwesomeIcon icon={faShoppingBag} />
                  {!isMobile && (
                    <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                      cartItemCount || 0
                    })`}</span>
                  )}
                </div>
                <div
                  onClick={() => navigate("/account/purchase")}
                  className="nav-function"
                >
                  <FontAwesomeIcon icon={faBox} />
                  {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
                </div>
              </div>
            </div>
          </div>
        </div>  
      )}
      <div className={`nav-logo ${loginStatus? '' : 'login-false'}`}>
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>
      {loginStatus && (
        <div className="nav-menu-area">
          <ul className="menu">
            {menuList.map((menu, index) => (
              <li key={index}>
                <a href="#">{menu}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
