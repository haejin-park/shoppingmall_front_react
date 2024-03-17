import * as types from '../../constants/product.constants';

const initialState = {
  loading: false,
  error: '',
  productList: [],
  product: {},
  searchQuery: {},
  totalPageNum: 1
};

function productReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: ''
      }
    case types.CREATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.GET_PRODUCT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.GET_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        productList: payload.productList,
        totalPageNum: payload.totalPageNum
      }
    case types.GET_PRODUCT_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.GET_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        product: payload.product
      }
    case types.GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.SEARCH_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.SEARCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        searchQuery: payload
      }
    case types.SEARCH_PRODUCT_FAIL:
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
