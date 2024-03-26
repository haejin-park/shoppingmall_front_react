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
import { useLocation, useNavigate } from "react-router-dom";
import { adminProductActions } from "../redux/actions/adminProductAction";
import { cartActions } from "../redux/actions/cartAction";
import { mainProductActions } from "../redux/actions/mainProductAction";
import { myOrderActions } from "../redux/actions/myOrderAction";
import { userActions } from "../redux/actions/userAction";
import SearchBox from "./SearchBox";


const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const [loginStatus, setLoginStatus] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [width, setWidth] = useState(0);
  const [overlayStatus, setOverlayStatus] = useState(false);
  const currentPath = location.pathname;
  const adminProductPath = '/admin/product';
  const myOrderPath ='/order';
  const cartPath = '/cart';
  const mainProductPath = '/';

  useEffect(() => {
    if(!user && (currentPath === '/login' || currentPath === '/register')) {
      setLoginStatus(false);
    } else {
      setLoginStatus(true);
    }
  }, [user, currentPath]);

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

  useEffect(() => {
    const handleEscapeKeyPress = (event) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscapeKeyPress);
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []); 

  const handleOpen = (width) => {
    setWidth(width);
    setOverlayStatus(true)
  }

  const handleClose = () => {
    setWidth(0);
    setOverlayStatus(false)
  }

  const goAdminProduct = (firstPage) => {
    setSearchValue('')
    dispatch(adminProductActions.changePage(firstPage));
    navigate(`${adminProductPath}?currentPage=${firstPage}`);
  }

  const goCart = (firstPage) => {
    setSearchValue('')
    dispatch(cartActions.changePage(firstPage));
    navigate(`${cartPath}?currentPage=${firstPage}`);
  }

  const goMyOrder = (firstPage) => {
    setSearchValue('')
    dispatch(myOrderActions.changePage(firstPage));
    navigate(`${myOrderPath}?currentPage=${firstPage}`);
  }

  const goMainProduct = (firstPage) => {
    setSearchValue('')
    dispatch(mainProductActions.changePage(firstPage));
    navigate(`${mainProductPath}?currentPage=${firstPage}`);
  }

  return (
    <div>
      {loginStatus && ( 
        <div>
          <div className="side-menu" style={{ width }}>
            <button className="closebtn" onClick={() => handleClose()}>
              &times;
            </button>
            <div className="mt-2 main-search-box">
              <SearchBox 
              placeholder="상품명 검색" 
              handleClose={handleClose} 
              width={width} 
              searchValue={searchValue} 
              setSearchValue={setSearchValue}
            />
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
                  <div onClick={() => goAdminProduct(1)} className="nav-function">
                    <FontAwesomeIcon icon={faUser} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>관리자</span>
                    )}
                  </div>
                )}
                {user ? 
                  <div onClick={() => dispatch(userActions.logout())} className="nav-function">
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
                <div onClick={() => goCart(1)} className="nav-function">
                  <FontAwesomeIcon icon={faShoppingBag} />
                  {!isMobile && (
                    <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                      cartItemCount || 0
                    })`}</span>
                  )}
                </div>
                <div
                  onClick={() => goMyOrder(1)}
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
        <div onClick={() => goMainProduct(1)}>
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </div>
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
