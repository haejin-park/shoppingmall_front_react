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
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import * as cartTypes from '../constants/cart.constants';
import * as orderTypes from '../constants/order.constants';
import * as productTypes from '../constants/product.constants';
import { cartActions } from "../redux/actions/cartAction";
import { userActions } from "../redux/actions/userAction";
import { transformEnglishSortBy } from "../utils/\bsortBy";
import { toTransformEnglishCategory } from "../utils/category";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";
  const inputRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const { mainSortBy:sortBy } = useSelector((state) => state.product);
  const { cartItemCount } = useSelector((state) => state.cart);
  const [loginStatus, setLoginStatus] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [width, setWidth] = useState(0);
  const [overlayStatus, setOverlayStatus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const adminProductPath = '/admin/product';
  const myOrderPath ='/my/order';
  const cartPath = '/cart';
  const mainProductPath = '/';

  useEffect(() => {
    if(!user && (currentPath === '/login' || currentPath === '/register')) {
      setLoginStatus(false);
    } else {
      setLoginStatus(true);
    }
  }, [user, currentPath]);

  useEffect(() => {
    if(user && user.level === "customer") {
      dispatch(cartActions.getCartItemCount())
    }
  },[user,dispatch]);


  useEffect(() => {
    if(navigationType === "POP") {
      setSearchValue(searchKeyword)
      dispatch({type:productTypes.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload: sortBy});
    }
  }, [navigationType, setSearchValue, searchKeyword, sortBy, dispatch]);

  useEffect(() => {
    if(inputRef.current)
    inputRef.current.focus();
  }, [width]);

  const onChangeHandler = (event) => {
    setSearchValue(event.target.value);
  }

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      let searchKeyword = event.target.value;   
      dispatch({type:productTypes.CHANGE_PAGE_OF_MAIN_PRODUCT, payload:1});
      searchCategory
      ? navigate(`${mainProductPath}?searchCategory=${searchCategory}&searchKeyword=${searchKeyword}`)
      : navigate(`${mainProductPath}?searchKeyword=${searchKeyword}`);
      if(width > 0) handleClose();
    }
  };

  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const categoryMenuList = [ "남성", "여성", "상의", "하의", "재킷", "셔츠", "블라우스", "팬츠", "스커트", "원피스"];

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

  const goAdminProduct = () => {
    setSearchValue('');
    setSelectedCategory('');
    const prevAdminSortBy = sessionStorage.getItem("prevAdminSortBy");
    if(prevAdminSortBy) sessionStorage.removeItem("prevAdminSortBy");
    dispatch({type:productTypes.SELECT_SORT_BY_ADMIN_PRODUCT_LIST, payload: "latest"});
    dispatch({type:productTypes.CHANGE_PAGE_OF_ADMIN_PRODUCT, payload:1});
    navigate(adminProductPath);
  }

  const goLogout = () => {
    dispatch(userActions.logout(user.email));
  }

  const goLogin = () => {
    setSearchValue('');
    setSelectedCategory('');
    navigate("/login")
  }
  const goCart = () => {
    setSearchValue('');
    setSelectedCategory('');
    dispatch({type:cartTypes.CHECKED_CART_ITEM, payload:{checkedItemList:[], checkedItemTotalPrice:0}});
    dispatch({type:orderTypes.SAVE_ORDER_ITEM, payload:{orderItemList:[], totalPrice:0, cartOrderStatus:true}});
    dispatch({type:cartTypes.CHANGE_PAGE_OF_CART, payload:1});
    navigate(cartPath);
  }

  const goMyOrder = () => {
    setSearchValue('')
    setSelectedCategory('');
    dispatch({type:cartTypes.CHECKED_CART_ITEM, payload:{checkedItemList:[], checkedItemTotalPrice:0}});
    dispatch({type:orderTypes.SAVE_ORDER_ITEM, payload:{orderItemList:[], totalPrice:0, cartOrderStatus:false}});
    dispatch({type:orderTypes.CHANGE_PAGE_OF_ORDER, payload:1});
    navigate(myOrderPath);
  }

  const goMainProduct = () => {
    setSearchValue('')
    setSelectedCategory('');
    const prevMainSortBy = sessionStorage.getItem("prevMainSortBy");
    if(prevMainSortBy) sessionStorage.removeItem("prevMainSortBy");
    dispatch({type:productTypes.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload: "popularity"});
    dispatch({type:cartTypes.CHECKED_CART_ITEM, payload:{checkedItemList:[], checkedItemTotalPrice:0}});
    dispatch({type:orderTypes.SAVE_ORDER_ITEM, payload:{orderItemList:[], totalPrice:0, cartOrderStatus:false}});
    dispatch({type:productTypes.CHANGE_PAGE_OF_MAIN_PRODUCT, payload:1});
    navigate(mainProductPath);
  }

  const goCategory = (category)=> {
    dispatch({type:cartTypes.CHECKED_CART_ITEM, payload:{checkedItemList:[], checkedItemTotalPrice:0}});
    dispatch({type:orderTypes.SAVE_ORDER_ITEM, payload:{orderItemList:[], totalPrice:0, cartOrderStatus:false}});
    const searchCategory = toTransformEnglishCategory(category);
    dispatch({type:productTypes.CHANGE_PAGE_OF_MAIN_PRODUCT, payload:1});
    searchKeyword
    ? navigate(`${mainProductPath}?searchCategory=${searchCategory}&searchKeyword=${searchKeyword}`)
    : navigate(`${mainProductPath}?searchCategory=${searchCategory}`);
    setSelectedCategory(category);
  }

  const selectSortBy = (value) => {
    const sortBy = transformEnglishSortBy(value)
    sessionStorage.setItem("prevMainSortBy", sortBy);
    dispatch({type:productTypes.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload: sortBy});
  }

  return (
    <div>
      {loginStatus && ( 
        <div>
          <div className="side-menu" style={{ width }}>
            <button className="closebtn" onClick={() => handleClose()}>
              &times;
            </button>
            <div className="mt-2 main-side-search-box">
              <div className="search-box">
                <FontAwesomeIcon className="search-icon" icon={faSearch} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="상품명 검색"
                  onKeyPress={onCheckEnter}
                  onChange={onChangeHandler}
                  value={searchValue}
                />
              </div>
            </div>
            <div className="side-menu-list" id="menu-list">
              {categoryMenuList.map((category, index) => (
                <div key={index}>
                  <button 
                  className ={`side-category-menu-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => goCategory(category)}>
                    {category}
                  </button>
                </div>
              ))}
            </div>
            <Dropdown
              className="main-side-sort-by-dropdown sort-by"
              align="start"
              onSelect={(value) => selectSortBy(value)}
            >
            <Dropdown.Toggle variant="light" id="dropdown-basic" align="start">
              정렬 기준
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {productTypes.SORT_BY.map((sort, index) => (
              <Dropdown.Item key={index} eventKey={sort}>{sort}</Dropdown.Item>
            ))}
            </Dropdown.Menu> 
            </Dropdown>
          </div>
          <div className={`overlay ${overlayStatus ? 'overlay-show' : ''}`}></div>
          <div className="nav-header">
            <div className="burger-menu">
              <FontAwesomeIcon icon={faBars} onClick={() => handleOpen(250)} />
            </div>
            <div>
              <div className="display-flex">
                <div className="nav-function mobile-search-icon" onClick={() => handleOpen(250)}>
                  <FontAwesomeIcon icon={faSearch} />
                  {!isMobile && (
                      <span style={{ cursor: "pointer" }}>상품 검색</span>
                  )}
                </div>
                {user && user.level === "admin" && (
                  <div onClick={() => goAdminProduct()} className="nav-function">
                    <FontAwesomeIcon icon={faUser} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>관리자</span>
                    )}
                  </div>
                )}
                {user ? 
                  <div onClick={() => goLogout()} className="nav-function">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>로그아웃</span>
                    )}
                  </div>
                  : 
                  <div onClick={() => goLogin()} className="nav-function">
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
                  </div>
                }        
                {user?.level === "customer" &&
                <div className="customer-navbar-menu">
                  <div onClick={() => goCart()} className="nav-function">
                    <FontAwesomeIcon icon={faShoppingBag} />
                    {!isMobile && (
                      <span style={{ cursor: "pointer" }}>{`장바구니(${
                        cartItemCount
                      })`}</span>
                    )}
                  </div>
                  <div
                    onClick={() => goMyOrder()}
                    className="nav-function"
                  >
                    <FontAwesomeIcon icon={faBox} />
                    {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
                  </div>
                </div>          
                }     
              </div>
            </div>
          </div>
        </div>  
      )}
      <div className={`nav-logo ${loginStatus? '' : 'login-false'}`}>
        <div onClick={() => goMainProduct()}>
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </div>
      </div>
      {loginStatus && (
        <div className="nav-menu-area">
          <div className="main-search-box">
            <div className="search-box">
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                ref={inputRef}
                type="text"
                placeholder="상품명 검색"
                onKeyPress={onCheckEnter}
                onChange={onChangeHandler}
                value={searchValue}
              />
            </div>
          </div>
          <ul className="menu">
            {categoryMenuList.map((category, index) => (
              <li key={index}>
                <button 
                  className={`category-menu-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => goCategory(category)}>{category}</button>
              </li>
            ))}
          </ul>
          <Dropdown
              className="main-sort-by-dropdown sort-by"
              align="start"
              onSelect={(value) => selectSortBy(value)}
            >
            <Dropdown.Toggle variant ="" id="dropdown-basic" align="start">
              정렬 기준
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {productTypes.SORT_BY.map((sort, index) => (
              <Dropdown.Item key={index} eventKey={sort}>{sort}</Dropdown.Item>
            ))}
            </Dropdown.Menu> 
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default Navbar;
