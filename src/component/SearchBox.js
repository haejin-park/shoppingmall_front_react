import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import { commonFnActions } from "../redux/actions/commonFnAction";

const SearchBox = ({ placeholder, field }) => {
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
    <div className="search-box">
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
      />
    </div>
  );
};

export default SearchBox;
