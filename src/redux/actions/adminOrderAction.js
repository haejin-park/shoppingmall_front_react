
import * as types from '../../constants/order.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getOrderList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_ADMIN_ORDER_LIST_REQUEST});
    const options = {params: {...query}};
    const response = await api.get("/order/admin", options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_ADMIN_ORDER_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_ADMIN_ORDER_LIST_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
export const adminOrderActions = {
  getOrderList
};
