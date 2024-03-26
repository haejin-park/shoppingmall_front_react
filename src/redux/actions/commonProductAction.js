import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({type:types.GET_PRODUCT_DETAIL_REQUEST});
    const response = await api.get(`/product/${id}`);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_PRODUCT_DETAIL_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_PRODUCT_DETAIL_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const selectProduct = (product) => async(dispatch) => {
  try {
    dispatch({type:types.SELECT_PRODUCT_REQUEST});
    dispatch({type:types.SELECT_PRODUCT_SUCCESS, payload:product});
  } catch(error) {
    dispatch({type:types.SELECT_PRODUCT_FAIL, payload:error.message});
  }
}

export const commonProductActions = {
  getProductDetail,
  selectProduct
};
