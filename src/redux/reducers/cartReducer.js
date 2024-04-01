import * as types from '../../constants/cart.constants';

const initialState = {
  loading: false,
  error: '',
  cartList: [],
  currentPage: 1,
  totalPageNum: 1,
  cartItemCount: 0,
  selectedItem: {},
  checkedItemList: [],
  checkedItemTotalPrice: 0,
  checkedAll: false,
};

function cartReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.ADD_TO_CART_REQUEST: 
    case types.CHANGE_PAGE_OF_CART_REQUEST:
    case types.GET_CART_LIST_REQUEST:
    case types.SELECT_CART_PRODUCT_REQUEST:
    case types.DELETE_CART_ITEM_REQUEST:
    case types.DELETE_CART_ITEM_LIST_REQUEST:
    case types.UPDATE_CART_ITEM_QTY_REQUEST:
    case types.GET_CART_ITEM_COUNT_REQUEST:
    case types.CHECKED_CART_ITEM_REQUEST:
    case types.CHECKED_ALL_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.ADD_TO_CART_FAIL: 
    case types.CHANGE_PAGE_OF_CART_FAIL:
    case types.GET_CART_LIST_FAIL:
    case types.SELECT_CART_PRODUCT_FAIL:
    case types.DELETE_CART_ITEM_FAIL:
    case types.DELETE_CART_ITEM_LIST_FAIL:
    case types.UPDATE_CART_ITEM_QTY_FAIL:
    case types.GET_CART_ITEM_COUNT_FAIL:
    case types.CHECKED_CART_ITEM_FAIL:
    case types.CHECKED_ALL_FAIL:
    return {
      ...state,
      loading: true,
      error: ''
    }    
    
    case types.ADD_TO_CART_SUCCESS: 
    case types.DELETE_CART_ITEM_SUCCESS:
    case types.DELETE_CART_ITEM_LIST_SUCCESS:
    case types.UPDATE_CART_ITEM_QTY_SUCCESS:
    case types.GET_CART_ITEM_COUNT_SUCCESS:
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

    case types.GET_CART_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        cartList: payload.cartList,
        totalPageNum: payload.totalPageNum,
        currentPage: payload.currentPage
      }    

    case types.SELECT_CART_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        selectedItem: payload
      }  

    case types.CHECKED_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        checkedItemList: payload.checkedItemList,
        checkedItemTotalPrice: payload.checkedItemTotalPrice
      }  

    case types.CHECKED_ALL_SUCCESS:
      console.log('payload.checkedAll',payload.checkedAll);
      return {
        ...state,
        loading: false,
        error: '',
        checkedAll: payload
      }  

    default: 
      return state; 
  }
}
export default cartReducer;
