import * as types from '../../constants/product.constants';
const initialState = {
  loading: false,
  error: '',
  productList: [],
  totalPageNum: 1,
  currentPage: 1,
};

function mainProductReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.GET_MAIN_PRODUCT_LIST_REQUEST:
    case types.CHANGE_PAGE_OF_MAIN_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.GET_MAIN_PRODUCT_LIST_FAIL:
    case types.CHANGE_PAGE_OF_MAIN_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.GET_MAIN_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        productList: payload.productList,
        totalPageNum: payload.totalPageNum,
        currentPage: payload.currentPage
      }

    case types.CHANGE_PAGE_OF_MAIN_PRODUCT_SUCCESS:
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

export default mainProductReducer;
