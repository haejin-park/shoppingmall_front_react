import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  totalPrice: 0,
  cartOrderStatus: false,
  orderNum: '',
  totalPageNum: 1,
  currentPage:1,
};

function myOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CHANGE_PAGE_OF_MY_ORDER_REQUEST:
    case types.SAVE_ORDER_ITEM_REQUEST:
    case types.CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.CHANGE_PAGE_OF_MY_ORDER_FAIL:
    case types.SAVE_ORDER_ITEM_FAIL:
    case types.CREATE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.CHANGE_PAGE_OF_MY_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        currentPage: payload
      }
      
    case types.SAVE_ORDER_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        orderList: payload.orderList,
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
  
    default: 
      return state; 
  }
}
export default myOrderReducer;
