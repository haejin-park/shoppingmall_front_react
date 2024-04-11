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
export const ADMIN_ORDER_STATUS = ["배송 중", "배송 완료", "환불 요청", "환불 완료"];
export const CUSTOMER_ORDER_STATUS = ["취소 요청", "교환 요청", "반품 요청"];
export const ADMIN_ORDER_STATUS_REASON = ["재고 부족으로 인한 환불", "주문 취소 또는 반품으로 인한 환불"];
export const CUSTOMER_ORDER_STATUS_REASON = ["소비자 귀책 사유:단순 변심", "소비자 귀책 사유:주문 실수", "판매자 귀책 사유:상품 파손", "판매자 귀책 사유:오배송", "판매자 귀책 사유:배송 지연"];
export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAIL = "UPDATE_ORDER_FAIL";
export const CHANGE_PAGE_OF_ORDER = "CHANGE_PAGE_OF_ORDER";
export const badgeBg = {
  preparing: "primary",
  cancelRequest: "secondary",
  shipping: "info",
  delivered: "success",
  exchangeRequest: "warning",
  returnRequest: "dark",
  refundRequest : "danger",
  refundComplete : "danger"
};
