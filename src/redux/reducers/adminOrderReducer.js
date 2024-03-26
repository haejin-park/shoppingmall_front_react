import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  orderList: [],
  totalPageNum: 1,
  currentPage:1,
};

function adminOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CHANGE_PAGE_OF_ADMIN_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.CHANGE_PAGE_OF_ADMIN_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.CHANGE_PAGE_OF_ADMIN_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        currentPage: payload
      }    
  
    default: 
      return state; 
  }
}
export default adminOrderReducer;
