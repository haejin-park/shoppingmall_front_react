import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderDetailDialog from "../component/OrderDetailDialog";
import OrderTable from "../component/OrderTable";
import SearchBox from "../component/SearchBox";
import * as types from "../constants/order.constants";
import { commonFnActions } from "../redux/actions/commonFnAction";
import { orderActions } from "../redux/actions/orderAction";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const dispatch = useDispatch();
  const {orderList, totalPageNum} = useSelector((state) => state.order);
  const {searchQuery, page} = useSelector((state) => state.fn);
  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    dispatch(orderActions.getOrderList({ ...searchQuery, page}));
  }, [query, page, searchQuery, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    navigate("?" + queryString);
  }, [searchQuery, navigate]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch({ type: types.SET_SELECTED_ORDER, payload: order });
  };

  const handlePageClick = ({ selected }) => {
    dispatch(commonFnActions.changePage(selected + 1))
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 mb-2 display-center">
          <SearchBox
            placeholder="오더번호"
            field="ordernum"
          />
        </div>
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
          forcePage={page - 1}
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

export default AdminOrderPage;
