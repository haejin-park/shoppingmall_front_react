import * as types from '../../constants/cart.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const addToCart = ( productId, selectedOptionObj, query, mode ) => async (dispatch) => {
  try {
    dispatch({type:types.ADD_TO_CART_REQUEST})
    const response = await api.post("/cart", {productId, selectedOptionObj});
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.data.message, "success"));
    dispatch({type:types.ADD_TO_CART_SUCCESS, payload: response.data.cartItemCount});
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
    dispatch({type:types.GET_CART_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_CART_LIST_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const deleteCartItem = (_id, query) => async (dispatch) => {
  try {
    if(!_id) throw new Error('삭제하려는 장바구니 항목의 ID가 존재하지 않습니다.');
    dispatch({type:types.DELETE_CART_ITEM_REQUEST});
    const response = await api.delete(`/cart/delete/${_id}`);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.DELETE_CART_ITEM_SUCCESS, payload: response.data.cartItemCount});
    dispatch(commonUiActions.showToastMessage("장바구니 항목 삭제를 완료했습니다.", "success"));
    await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.DELETE_CART_ITEM_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const deleteCartItemList = (deletedItemIdList, query) => async (dispatch) => {
  try {
    dispatch({type:types.DELETE_CART_ITEM_LIST_REQUEST});
    let response;
    for(const _id of deletedItemIdList) {
      response = await api.delete(`/cart/delete/${_id}`);
    }
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.DELETE_CART_ITEM_LIST_SUCCESS, payload: response.data.cartItemCount});
    dispatch(commonUiActions.showToastMessage("장바구니 항목 삭제를 완료했습니다.", "success"));
    await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.DELETE_CART_ITEM_LIST_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const updateCartItemQty = (productId, cartItemInitialOptionObj, selectedOptionObj, query) => async (dispatch) => {
  try {
    dispatch({type:types.UPDATE_CART_ITEM_QTY_REQUEST})
    const response = await api.put("/cart", {productId, cartItemInitialOptionObj, selectedOptionObj});
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.data.message, "success"));
    dispatch({type:types.UPDATE_CART_ITEM_QTY_SUCCESS, payload: response.data.cartItemCount});
    await dispatch(cartActions.getCartList(query));
  } catch(error) {
    dispatch({type:types.UPDATE_CART_ITEM_QTY_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const getCartItemCount = (cartItemCount) => async (dispatch) => {
  try {
    dispatch({type:types.GET_CART_ITEM_COUNT_REQUEST});
    if(!cartItemCount) {
      const response = await api.get(`/cart/qty`);
      if(response.status !== 200) throw new Error(response.message);
      dispatch({type:types.GET_CART_ITEM_COUNT_SUCCESS, payload:response.data.cartItemCount});
    } else {
      dispatch({type:types.GET_CART_ITEM_COUNT_SUCCESS, payload:cartItemCount});
    }
  } catch(error) {
    dispatch({type:types.GET_CART_ITEM_COUNT_FAIL, payload:error.message});
  }
};

export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  deleteCartItemList,
  updateCartItemQty,
  getCartItemCount,
};
