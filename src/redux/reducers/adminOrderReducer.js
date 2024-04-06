import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  totalPrice: 0,
  totalPageNum: 1,
  currentPage:1,
};

function adminOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.GET_ADMIN_ORDER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.GET_ADMIN_ORDER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.CHANGE_PAGE_OF_ADMIN_ORDER:
      return {
        ...state,
        loading: false,
        error: '',
        currentPage: payload
      }    
  
    case types.GET_ADMIN_ORDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        orderList: payload.orderList,
        totalPageNum: payload.totalPageNum,
        currentPage: payload.currentPage
      }    
    default: 
      return state; 
  }
}
export default adminOrderReducer;
