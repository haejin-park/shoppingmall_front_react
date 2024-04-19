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
export const ADMIN_ORDER_STATUS = ["배송 중", "배송 완료", "환불 요청", "환불 완료", "환불 불가", "교환 불가"];
export const CUSTOMER_ORDER_STATUS = ["취소 요청", "교환 요청", "반품 요청"];
export const ADMIN_ORDER_STATUS_REASON = ["판매자 귀책 : 재고 부족으로 인한 환불", "소비자 귀책 : 상품 파손으로 인한 환불 불가", "수거 전 : 재고 부족으로 인한 교환 불가", "소비자 귀책 : 상품 파손으로 인한 교환 불가"]
export const CUSTOMER_ORDER_STATUS_REASON = ["소비자 귀책 사유:단순 변심", "소비자 귀책 사유:주문 실수", "판매자 귀책 사유:상품 파손", "판매자 귀책 사유:오배송", "판매자 귀책 사유:배송 지연"];
export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAIL = "UPDATE_ORDER_FAIL";
export const CHANGE_PAGE_OF_ORDER = "CHANGE_PAGE_OF_ORDER";
export const orderTableHeader = ["#", "주문 번호", "주문 날짜", "사용자 이메일", "주문 상품명", "주소", "총 금액", "상태"];

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
