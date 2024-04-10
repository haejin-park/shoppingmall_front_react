import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductDetailDialog from "../component/ProductDetailDialog";
import ProductTable from "../component/ProductTable";
import * as types from '../constants/product.constants';
import { productActions } from "../redux/actions/productAction";
import "../style/adminProduct.style.css";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, adminProductList:productList, adminTotalPageNum:totalPageNum, adminCurrentPage:currentPage} = useSelector((state) => state.product); 
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("new");
  const [sortBy, setSortBy] = useState("latest");
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";

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
    //url쿼리 읽어오기(query) => 쿼리 값에 맞춰서 상품리스트 가져오기
    dispatch(productActions.getAdminProductList({searchKeyword, currentPage, sortBy}));
  }, [query, searchKeyword, currentPage, dispatch, sortBy, totalPageNum]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const deleteItem = (id) => {
    //아이템 삭제하기 후 미들웨어에서 다시 조회 함수 호출
    dispatch(productActions.deleteProduct(id,{searchKeyword, currentPage, sortBy}));
  };

  const openEditForm = (product) => {
    dispatch({type:types.SET_SELECTED_PRODUCT, payload:product});
    //edit모드로 설정하고
    setMode('edit');
    // 아이템 수정다이얼로그 열어주기
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode('new');
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT, payload:selected + 1});
  };

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
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>
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
          forcePage={currentPage - 1} // 1페이지면 여긴 2가됨 (한개씩 +1 되므로 -1해줘야함)
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
          className="display-center list-style-none"
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
