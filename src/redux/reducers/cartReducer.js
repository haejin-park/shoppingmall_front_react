import * as types from '../../constants/cart.constants';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  currentPage: 1,
  totalPageNum: 1,
  cartItemCount: 0,
};

function cartReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.ADD_TO_CART_REQUEST: 
    case types.CHANGE_PAGE_OF_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.ADD_TO_CART_FAIL: 
    case types.CHANGE_PAGE_OF_CART_FAIL:
    return {
      ...state,
      loading: true,
      error: ''
    }    
    
    case types.ADD_TO_CART_SUCCESS: 
      return {
        ...state,
        loading: true,
        error: '',
        cartItemCount: payload.cartItemCount
      }
    
    case types.CHANGE_PAGE_OF_CART_SUCCESS:
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
export default cartReducer;
