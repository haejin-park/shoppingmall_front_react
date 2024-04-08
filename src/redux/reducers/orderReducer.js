import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  totalPrice: 0,
  cartOrderStatus: false,
  totalPageNum: 1,
  currentPage:1,
  selectedOrder: {},
  order: {},
};

function orderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CREATE_ORDER_REQUEST:
    case types.GET_ORDER_LIST_REQUEST:
    case types.GET_ORDER_DETAIL_REQUEST:
    case types.UPDATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.CREATE_ORDER_FAIL:
    case types.GET_ORDER_LIST_FAIL:
    case types.GET_ORDER_DETAIL_FAIL:
    case types.UPDATE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
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

    case types.GET_ORDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        orderList: payload.orderList,
        totalPageNum: payload.totalPageNum,
        currentPage: payload.currentPage
      } 
      
    case types.CHANGE_PAGE_OF_ORDER:
      return {
        ...state,
        loading: false,
        error: '',
        currentPage: payload
      }    

    case types.SET_SELECTED_ORDER:
      return {
        ...state,
        loading: false,
        error: '',
        selectedOrder: payload
      }

    case types.GET_ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        order: payload.order
      }  
  
    case types.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
      }  

    default: 
      return state; 
  }
}
export default orderReducer;
