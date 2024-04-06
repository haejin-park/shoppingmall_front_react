import React, { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderDetailDialog from "../component/OrderDetailDialog";
import OrderTable from "../component/OrderTable";
import * as types from "../constants/order.constants";
import { adminOrderActions } from "../redux/actions/adminOrderAction";

const AdminOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, orderList, totalPageNum, currentPage} = useSelector((state) => state.adminOrder);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";

  const tableHeader = [
    "#",
    "Order Number",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    dispatch(adminOrderActions.getOrderList({searchKeyword, currentPage}));
  }, [query, searchKeyword, currentPage, dispatch]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch({ type: types.SET_SELECTED_ORDER, payload: order });
  };

  const handlePageClick = ({ selected }) => {
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_ORDER, payload:selected + 1});

  };

  const handleClose = () => {
    setOpen(false);
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
        {error && (
          <div>
            <Alert variant="danger" className="error-message">
              {error}
            </Alert>
          </div>
        )}
        <OrderTable
          header={tableHeader}
          orderList={orderList}
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
          className="display-center list-style-none"
        />
      </Container>
      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrder;
