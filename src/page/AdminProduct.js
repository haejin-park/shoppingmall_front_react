import React, { useEffect, useState } from "react";
import { Button, Container, Dropdown, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import ProductDetailDialog from "../component/ProductDetailDialog";
import ProductTable from "../component/ProductTable";
import * as types from '../constants/product.constants';
import { productActions } from "../redux/actions/productAction";
import "../style/adminProduct.style.css";
import { transformEnglishSortBy } from "../utils/sortBy";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, adminProductList:productList, adminTotalPageNum:totalPageNum, adminCurrentPage:currentPage, adminSortBy: sortBy} = useSelector((state) => state.product); 
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("new");
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const navigationType = useNavigationType();
  const prevAdminSortBy = sessionStorage.getItem("prevAdminSortBy");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];
  
  useEffect(() => { 
    if(navigationType === "POP" && prevAdminSortBy) {
      let sortBy = prevAdminSortBy;
      dispatch({type:types.SELECT_SORT_BY_ADMIN_PRODUCT_LIST, payload: sortBy});
      dispatch(productActions.getAdminProductList({searchKeyword, currentPage, sortBy: prevAdminSortBy}));
    } else if(navigationType !== "POP"){
      dispatch(productActions.getAdminProductList({searchKeyword, currentPage, sortBy}));
    }
  }, [navigationType, query, searchKeyword, currentPage, dispatch, sortBy, totalPageNum, prevAdminSortBy]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const deleteItem = (id) => {
    dispatch(productActions.deleteProduct(id,{searchKeyword, currentPage, sortBy}));
  };

  const openEditForm = (product) => {
    dispatch({type:types.SET_SELECTED_PRODUCT, payload:product});
    setMode('edit');
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode('new');
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT, payload:selected + 1});
  };

  const selectSortBy = (value) => {
    const sortBy = transformEnglishSortBy(value)
    sessionStorage.setItem("prevAdminSortBy", sortBy);
    dispatch({type:types.SELECT_SORT_BY_ADMIN_PRODUCT_LIST, payload: sortBy});
  }

  return (
    <div className="locate-center">
      <Container>
        {loading && (
          <div className="spinner-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden loading-message">Loading...</span>
          </Spinner>
        </div>
        )}
        <div className="admin-product-sort-by-and-add-btn">
          <Dropdown
              className="admin-side-sort-by-dropdown sort-by"
              align="start"
              onSelect={(value) => selectSortBy(value)}
            >
            <Dropdown.Toggle id="dropdown-basic" align="start">
              상품 정렬 기준
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {types.SORT_BY.map((sort, index) => (
              <Dropdown.Item key={index} eventKey={sort}>{sort}</Dropdown.Item>
            ))}
            </Dropdown.Menu> 
          </Dropdown>
          <Button className="product-add-btn" onClick={handleClickNewItem}>
            Add New Item +
          </Button>
        </div>
        <ProductTable
          header={tableHeader}
          productList={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={8}
          pageCount={totalPageNum}
          forcePage={currentPage - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </Container>
      <ProductDetailDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        sortBy={sortBy}
      />
    </div>
  );
};

export default AdminProduct;
