import * as types from '../../constants/cart.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const addToCart = ( productId, selectedOptionObj, query, mode ) => async (dispatch) => {
  try {
    console.log('productId', productId);
    console.log('selectedOptionObj', selectedOptionObj);
    console.log('query', query);
    console.log('mode', mode);
    dispatch({type:types.ADD_TO_CART_REQUEST})
    const response = await api.post("/cart", {productId, selectedOptionObj});
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.data.message, "success"));
    dispatch({type:types.ADD_TO_CART_SUCCESS, payload: response.data});
    if(mode === "edit") await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.ADD_TO_CART_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const getCartList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_CART_LIST_REQUEST});
    let options = {params: {...query}};
    const response = await api.get("/cart", options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.message, "success"));
    dispatch({type:types.GET_CART_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_CART_LIST_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const selectCartProduct = (item) => async(dispatch) => {
  try {
    dispatch({type:types.SELECT_CART_PRODUCT_REQUEST});
    dispatch({type:types.SELECT_CART_PRODUCT_SUCCESS, payload:item});
  } catch(error) {
    dispatch({type:types.SELECT_CART_PRODUCT_FAIL, payload:error.message});
  }
}
const deleteCartItem = (_id, query) => async (dispatch) => {
  try {
    console.log('_id', _id);
    console.log('query', query);
    if(!_id) throw new Error('삭제하려는 장바구니 항목의 ID가 존재하지 않습니다.');
    dispatch({type:types.DELETE_CART_ITEM_REQUEST});
    const response = await api.delete(`/cart/delete/${_id}`);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.DELETE_CART_ITEM_SUCCESS, payload: response.data});
    dispatch(commonUiActions.showToastMessage("장바구니 항목 삭제를 완료했습니다.", "success"));
    await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.DELETE_CART_ITEM_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }

};

const updateCartItemQty = (productId, selectedOptionObj, query) => async (dispatch) => {
  try {
    console.log('productId', productId);  
    console.log('selectedOptionObj', selectedOptionObj);
    console.log('query', query);
    dispatch({type:types.UPDATE_CART_ITEM_QTY_REQUEST})
    const response = await api.put("/cart", {productId, selectedOptionObj});
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.data.message, "success"));
    dispatch({type:types.UPDATE_CART_ITEM_QTY_SUCCESS, payload: response.data});
    await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.UPDATE_CART_ITEM_QTY_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const getCartQty = () => async (dispatch) => {};

const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_CART_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_CART_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_CART_FAIL, payload:error.message});
  }
}

export const cartActions = {
  addToCart,
  getCartList,
  selectCartProduct,
  deleteCartItem,
  updateCartItemQty,
  getCartQty,
  changePage,
};
