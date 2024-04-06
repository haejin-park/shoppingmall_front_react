import * as types from '../../constants/order.constants';
import api from '../../utils/api';
import { cartActions } from './cartAction';
import { commonUiActions } from './commonUiAction';

const createOrder = (orderList, cartOrderStatus, navigate) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_ORDER_REQUEST});
    const response = await api.post('/order', {orderList, cartOrderStatus})
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_ORDER_SUCCESS, payload:response.data});
    dispatch(cartActions.getCartItemCount(response.data.cartItemCount));
    navigate('/order/complete');
  } catch(error) {
    dispatch({type:types.CREATE_ORDER_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
const getOrderList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_MY_ORDER_LIST_REQUEST});
    const options = {params: {...query}};
    const response = await api.get("/order/my", options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_MY_ORDER_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_MY_ORDER_LIST_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

export const myOrderActions = {
  createOrder,
  getOrderList
};

