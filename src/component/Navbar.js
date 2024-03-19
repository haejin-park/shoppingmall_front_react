
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
  faRightToBracket,
  faUser,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { productActions } from "../redux/actions/productAction";
import { userActions } from "../redux/actions/userAction";

const Navbar = ({ user }) => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  let [loginStatus, setLoginStatus] = useState(true);
  const [showSearchBox, setShowSearchBox] = useState(false);
  useEffect(() => {
    if(!user && location.pathname === '/login' || location.pathname === '/register') {
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
  //넘겨야할거 => 검색어 => state등록
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        dispatch(productActions.searchProduct());
      } else {
        dispatch(productActions.searchProduct({name: event.target.value}));
      }
    }
  };
  const logout = () => {
    dispatch(userActions.logout());  
  };
  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {loginStatus && (
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>
        <div className="side-search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="제품검색"
            onKeyPress={onCheckEnter}
          />
        </div>
        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      )}
      {loginStatus && ( 
        <div className="nav-header">
          <div className="burger-menu">
            <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
          </div>
          <div>
            <div className="display-flex">
              {user && user.level === "admin" && (
                <div onClick={() => navigate("/admin/product?page=1")} className="nav-icon">
                  <FontAwesomeIcon icon={faUser} />
                  {!isMobile && (
                    <span style={{ cursor: "pointer" }}>관리자</span>
                  )}
                </div>
              )}
              {user ? 
                <div onClick={logout} className="nav-icon">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  {!isMobile && (
                    <span style={{ cursor: "pointer" }}>로그아웃</span>
                  )}
                </div>
                : 
                <div onClick={() => navigate("/login")} className="nav-icon">
                  <FontAwesomeIcon icon={faRightToBracket} />
                  {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
                </div>
              }             
              <div onClick={() => navigate("/cart")} className="nav-icon">
                <FontAwesomeIcon icon={faShoppingBag} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                    cartItemCount || 0
                  })`}</span>
                )}
              </div>
              <div
                onClick={() => navigate("/account/purchase")}
                className="nav-icon"
              >
                <FontAwesomeIcon icon={faBox} />
                {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
              </div>
              {isMobile && (
                <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                  <FontAwesomeIcon icon={faSearch} />
                </div>
              )}

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
          {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
            <div className="search-box landing-search-box ">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default Navbar;
