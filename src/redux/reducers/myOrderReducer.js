import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  orderItemList: [],
  totalPrice: 0,
  cartOrderStatus: false,
  orderNum: '',
  totalPageNum: 1,
  currentPage:1,
};

function myOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CREATE_ORDER_REQUEST:
    case types.GET_MY_ORDER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.CREATE_ORDER_FAIL:
    case types.GET_MY_ORDER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.CHANGE_PAGE_OF_MY_ORDER:
      return {
        ...state,
        loading: false,
        error: '',
        currentPage: payload
      }
      
    case types.SAVE_ORDER_ITEM:
      return {
        ...state,
        loading: false,
        error: '',
        orderItemList: payload.orderItemList,
        totalPrice: payload.totalPrice,
        cartOrderStatus: payload.cartOrderStatus
      }    

    case types.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        orderNum: payload.orderNum,
      }    
  
    case types.GET_MY_ORDER_LIST_SUCCESS:
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
export default myOrderReducer;
