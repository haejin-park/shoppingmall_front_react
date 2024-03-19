import * as types from '../../constants/product.constants';

const initialState = {
  loading: false,
  error: '',
  productList: [],
  product: {},
  selectedProduct: {},
  totalPageNum: 1,
};

function productReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.CREATE_PRODUCT_REQUEST:
    case types.GET_PRODUCT_LIST_REQUEST:
    case types.SELECT_PRODUCT_REQUEST:
    case types.GET_PRODUCT_DETAIL_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.CREATE_PRODUCT_FAIL:
    case types.GET_PRODUCT_LIST_FAIL:
    case types.SELECT_PRODUCT_FAIL:
    case types.GET_PRODUCT_DETAIL_FAIL:
    case types.UPDATE_PRODUCT_FAIL:
    case types.DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.CREATE_PRODUCT_SUCCESS:
    case types.UPDATE_PRODUCT_SUCCESS:
    case types.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
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

export default productReducer;
