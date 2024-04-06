import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  selectedOrder: {},
  order: {},
};

function commonOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.GET_ORDER_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.GET_ORDER_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
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

    default: 
      return state; 
  }
}
export default commonOrderReducer;
