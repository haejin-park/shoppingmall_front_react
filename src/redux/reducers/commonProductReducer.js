import * as types from '../../constants/product.constants';
//소비자, 관리자 공통으로 사용되는 것만 
const initialState = {
  loading: false,
  error: '',
  selectedProduct: {},
  product: {},
};

function commonProductReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.SELECT_PRODUCT_REQUEST:
    case types.GET_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.SELECT_PRODUCT_FAIL:
    case types.GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.SELECT_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        selectedProduct: payload
      }
  
    case types.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        product: payload.product
      }  

    default: 
      return state;  
  }
}

export default commonProductReducer;
