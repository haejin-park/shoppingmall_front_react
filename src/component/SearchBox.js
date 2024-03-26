import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { adminOrderActions } from "../redux/actions/adminOrderAction";
import { adminProductActions } from "../redux/actions/adminProductAction";
import { mainProductActions } from "../redux/actions/mainProductAction";
import { myOrderActions } from "../redux/actions/myOrderAction";
const SearchBox = ({ placeholder, handleClose, width, show, searchValue, setSearchValue }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminProductPath = '/admin/product';
  const adminOrderPath ='/admin/order';
  const myOrderPath ='/order';
  const mainProductPath = '/';
  const inputRef = useRef(null);

  const onChangeHandler = (event) => {
    setSearchValue(event.target.value);
  }

  // 검색창 열릴 때 입력필드 포커스
  useEffect(() => {
    if(inputRef.current)
    inputRef.current.focus();
  }, [width, show]);

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
      } else {
        dispatch(mainProductActions.changePage(1));
        navigate(`${mainProductPath}?searchKeyword=${searchKeyword}&currentPage=${1}`);
      }   
      if(width > 0) handleClose();
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
