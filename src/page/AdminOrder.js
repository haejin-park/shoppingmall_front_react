import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderDetailDialog from "../component/OrderDetailDialog";
import OrderTable from "../component/OrderTable";
import * as types from "../constants/order.constants";
import { orderActions } from "../redux/actions/orderAction";
import "../style/adminOrder.style.css";

const AdminOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, orderList, totalPageNum, currentPage} = useSelector((state) => state.order);
  const [open, setOpen] = useState(false);
  const [query] = useSearchParams();
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
    dispatch(orderActions.getOrderList({searchKeyword, currentPage}, "admin"));
  }, [query, searchKeyword, currentPage, dispatch]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const handlePageClick = ({ selected }) => {
    dispatch({type:types.CHANGE_PAGE_OF_ORDER, payload:selected + 1});

  };

  const openEditForm = (order) => {
    setOpen(true);
    dispatch({ type: types.SET_SELECTED_ORDER, payload: order });
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
        <div className="admin-order-table">
          {orderList.length <= 0
            ? 
              <div className="empty">
                <h3>주문한 상품이 없습니다.</h3>
              </div>
            : orderList?.flatMap((order, index) => (
            <OrderTable
              key={index} 
              index={index}
              order={order}
              header={tableHeader}
              openEditForm={openEditForm}
            />
            ))
          }
        </div>
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
      {open && <OrderDetailDialog open={open} handleClose={handleClose} mode="admin" />}
    </div>
  );
};

export default AdminOrder;
