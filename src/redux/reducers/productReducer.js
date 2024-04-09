import * as types from '../../constants/product.constants';

const initialState = {
  loading: false,
  error: '',
  mainProductList:[],
  mainTotalPageNum: 1,
  mainCurrentPage: 1,
  adminProductList: [],
  adminTotalPageNum: 1,
  adminCurrentPage: 1,
  selectedProduct: {},
  product: {},
};

function productReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.GET_MAIN_PRODUCT_LIST_REQUEST:
    case types.GET_ADMIN_PRODUCT_LIST_REQUEST:
    case types.CREATE_PRODUCT_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.DELETE_PRODUCT_REQUEST:
    case types.GET_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case types.GET_MAIN_PRODUCT_LIST_FAIL:
    case types.GET_ADMIN_PRODUCT_LIST_FAIL:
    case types.CREATE_PRODUCT_FAIL:
    case types.UPDATE_PRODUCT_FAIL:
    case types.DELETE_PRODUCT_FAIL:
    case types.GET_PRODUCT_DETAIL_FAIL:
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
    
    case types.GET_MAIN_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        mainProductList: payload.productList,
        mainTotalPageNum: payload.totalPageNum,
        mainCurrentPage: payload.currentPage
      }

    case types.CHANGE_PAGE_OF_MAIN_PRODUCT:
      return {
        ...state,
        loading: false,
        error: '',
        mainCurrentPage: payload
      }      

    case types.GET_ADMIN_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        adminProductList: payload.productList,
        adminTotalPageNum: payload.totalPageNum,
        adminCurrentPage: payload.currentPage
      }

    case types.CHANGE_PAGE_OF_ADMIN_PRODUCT:
      return {
        ...state,
        loading: false,
        error: '',
        adminCurrentPage: payload
      }    


    case types.SET_SELECTED_PRODUCT:
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
