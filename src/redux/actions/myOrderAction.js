import * as types from '../../constants/order.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const saveOrderItem = (orderList, totalPrice, cartOrderStatus) => async(dispatch) => {
  try {
    dispatch({type:types.SAVE_ORDER_ITEM_REQUEST});
    dispatch({type:types.SAVE_ORDER_ITEM_SUCCESS, payload:{orderList, totalPrice, cartOrderStatus}});
  } catch(error) {
    dispatch({type:types.SAVE_ORDER_ITEM_FAIL, payload:error.message});
  }
}
const createOrder = (orderData, cartOrderStatus, navigate) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_ORDER_REQUEST});
    const response = await api.post('/order', {orderData, cartOrderStatus})
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_ORDER_SUCCESS, payload:response.data});
    navigate('/order/complete');
  } catch(error) {
    dispatch({type:types.CREATE_ORDER_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
const getOrderList = (query) => async (dispatch) => {};
const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_FAIL, payload:error.message});
  }
}
export const myOrderActions = {
  saveOrderItem,
  createOrder,
  getOrderList,
  changePage,
};
