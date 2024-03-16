import * as types from '../../constants/product.constants';

const initialState = {
  loading: false,
  error: '',
  products: [],
  product: {},
  searchQuery: {},
};

function productReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.PRODUCT_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.PRODUCT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: ''
      }
    case types.PRODUCT_CREATE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.PRODUCT_GET_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.PRODUCT_GET_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        products: payload.products
      }
    case types.PRODUCT_GET_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.PRODUCT_GET_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.PRODUCT_GET_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        product: payload.product
      }
    case types.PRODUCT_GET_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.SAVE_SEARCH_KEYWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.SAVE_SEARCH_KEYWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        searchQuery: payload
      }
    case types.SAVE_SEARCH_KEYWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }        
    default: 
      return state;  
  }
}

export default productReducer;
