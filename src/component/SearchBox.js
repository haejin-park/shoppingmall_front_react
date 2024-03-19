import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { commonFnActions } from "../redux/actions/commonFnAction";
import { useLocation } from "react-router";

const SearchBox = ({ placeholder, field }) => {
  let [mainPageStatus, setMainPageStatus] = useState(true);
  let location = useLocation();

  useEffect(() => {
    if(location.pathname === '/') {
      setMainPageStatus(true);
    } else {
      setMainPageStatus(false);
    }
  }, [location.pathname]);

  const dispatch = useDispatch();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        dispatch(commonFnActions.searchKeyword());
      } else {
        dispatch(commonFnActions.searchKeyword({[field]: event.target.value}));
      }
    }
  };
  return (
    <div className={`${mainPageStatus? 'main-search-box': ''} search-box`}>
      <FontAwesomeIcon icon={faSearch} />
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
      />
    </div>
  );
};

export default SearchBox;
