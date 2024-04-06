import * as types from '../../constants/product.constants';

const initialState = {
  loading: false,
  error: '',
  productList: [],
  totalPageNum: 1,
  currentPage: 1,
};

function adminProductReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.GET_ADMIN_PRODUCT_LIST_REQUEST:
    case types.CREATE_PRODUCT_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.GET_ADMIN_PRODUCT_LIST_FAIL:
    case types.CREATE_PRODUCT_FAIL:
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

    case types.GET_ADMIN_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        productList: payload.productList,
        totalPageNum: payload.totalPageNum,
        currentPage: payload.currentPage
      }

    case types.CHANGE_PAGE_OF_ADMIN_PRODUCT:
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

export default adminProductReducer;
