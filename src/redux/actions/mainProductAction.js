import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getProductList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_REQUEST});
    const response = await api.get(`/product`, {params: {...query}});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

export const mainProductActions = {
  getProductList
};
