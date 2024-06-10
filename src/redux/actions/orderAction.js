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

const getOrderList = (query, mode) => async (dispatch) => {
  try {
    dispatch({type:types.GET_ORDER_LIST_REQUEST});
    const options = {params: {...query}};
    options.params.mode = mode;
    const response = await api.get("/order", options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_ORDER_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_ORDER_LIST_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const updateOrder = (id, orderItemIdList, orderStatusList, orderStatusReasonList, query, mode) => async (dispatch) => {
  try {
    dispatch({type:types.UPDATE_ORDER_REQUEST});
    const response = await api.put(`/order/${id}`,{orderItemIdList, orderStatusList, orderStatusReasonList});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.UPDATE_ORDER_SUCCESS, payload: response.data});
    dispatch(commonUiActions.showToastMessage("주문 상태 수정을 완료했습니다.", "success"));
    dispatch(orderActions.getOrderList(query, mode));
  } catch(error) {
    dispatch({type:types.UPDATE_ORDER_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

export const orderActions = {
  createOrder,
  getOrderList,
  updateOrder,
};
