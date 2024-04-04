import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import { useSearchParams } from "react-router-dom";
import { adminOrderActions } from "../redux/actions/adminOrderAction";
import { adminProductActions } from "../redux/actions/adminProductAction";
import { cartActions } from "../redux/actions/cartAction";
import { myOrderActions } from "../redux/actions/myOrderAction";
const SearchBox = ({ placeholder, show, searchValue, setSearchValue }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminProductPath = '/admin/product';
  const adminOrderPath ='/admin/order';
  const myOrderPath ='/my/order';
  const cartPath ='/cart';
  const inputRef = useRef(null);
  const navigationType = useNavigationType();
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";

  useEffect(() => {
    if(navigationType === "POP") setSearchValue(searchKeyword)
  }, [navigationType, setSearchValue, searchKeyword]);

  // 관리자 검색창 열릴 때 입력필드 포커스
  useEffect(() => {
    if(inputRef.current)
    inputRef.current.focus();
  }, [show]);

  const onChangeHandler = (event) => {
    setSearchValue(event.target.value);
  }

  //각 페이지에서 keyword읽을 수 있게 naviagte에 쿼리스트링 보내주고,
  //처음 검색할 때 1페이지가 되게 dispatch해주면 
  //각 페이지에서 page 넣어서 url 바꿔줌
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      let currentPath = location.pathname;
      let searchKeyword = event.target.value;   
      if(currentPath === adminProductPath) {
        dispatch(adminProductActions.changePage(1));
        navigate(`${currentPath}?searchKeyword=${searchKeyword}&currentPage=${1}`);
      } else if(currentPath === adminOrderPath) {
        dispatch(adminOrderActions.changePage(1));
        navigate(`${currentPath}?searchKeyword=${searchKeyword}&currentPage=${1}`);
      } else if(currentPath === myOrderPath) {
        dispatch(myOrderActions.changePage(1));
        navigate(`${currentPath}?searchKeyword=${searchKeyword}&currentPage=${1}`);
      } else if(currentPath === cartPath) {
        dispatch(cartActions.changePage(1));
        navigate(`${currentPath}?searchKeyword=${searchKeyword}&currentPage=${1}`);
      }   
    }
  };

  return (
    <div className="search-box">
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={onChangeHandler}
        value={searchValue}
      />
    </div>
  );
};

export default SearchBox;
