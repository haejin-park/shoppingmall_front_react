export const SAVE_ORDER_ITEM = "SAVE_ORDER_ITEM";
export const CREATE_ORDER_REQUEST = "CREATE_ORDER_REQUEST";
export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS";
export const CREATE_ORDER_FAIL = "CREATE_ORDER_FAIL";
export const GET_ORDER_DETAIL_REQUEST = "GET_ORDER_DETAIL_REQUEST";
export const GET_ORDER_DETAIL_SUCCESS = "GET_ORDER_DETAIL_SUCCESS";
export const GET_ORDER_DETAIL_FAIL = "GET_ORDER_DETAIL_FAIL";
export const GET_ORDER_LIST_REQUEST = "GET_ORDER_LIST_REQUEST";
export const GET_ORDER_LIST_SUCCESS = "GET_ORDER_LIST_SUCCESS";
export const GET_ORDER_LIST_FAIL = "GET_ORDER_LIST_FAIL";
export const SET_SELECTED_ORDER = "SET_SELECTED_ORDER";
export const ADMIN_ORDER_STATUS = ["preparing", "shipping", "delivered", "refund"];
export const CUSTOMER_ORDER_STATUS = ["cancel", "return"];
export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAIL = "UPDATE_ORDER_FAIL";
export const CHANGE_PAGE_OF_ORDER = "CHANGE_PAGE_OF_ORDER";
export const badgeBg = {
  preparing: "primary",
  shipping: "warning",
  refund: "danger",
  delivered: "success",
  cancel: "secondary",
  return: "dark"
};
