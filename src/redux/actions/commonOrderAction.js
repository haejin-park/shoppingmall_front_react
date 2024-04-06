import * as types from '../../constants/order.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getOrderDetail = (id) => async (dispatch) => {
  try {
    dispatch({type:types.GET_ORDER_DETAIL_REQUEST});
    const response = await api.get(`/order/${id}`);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_ORDER_DETAIL_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_ORDER_DETAIL_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
const updateOrder = (id, status) => async (dispatch) => {};

export const commonOrderActions = {
  getOrderDetail,
  updateOrder
};
