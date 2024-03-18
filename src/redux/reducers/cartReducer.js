import * as types from '../../constants/cart.constants';

const initialState = {
  loading: false,
  error: '',
  cartItemCount: 0,
};

function cartReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.ADD_TO_CART_REQUEST: 
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.ADD_TO_CART_FAIL: 
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

    default: 
      return state; 
  }
}
export default cartReducer;
