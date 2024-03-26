import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getProductList = (query,sortBy) => async (dispatch) => {
  try {
    // console.log('mainProductAction query',query);
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_REQUEST});
    let options = {params: {...query}};
    if(sortBy === 'latest') options.params.sortBy = 'latest';
    if(sortBy === 'orderOfPurchase') options.params.sortBy = 'orderOfPurchase'; 
    const response = await api.get(`/product`, options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_MAIN_PRODUCT_LIST_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_MAIN_PRODUCT_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_MAIN_PRODUCT_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_MAIN_PRODUCT_FAIL, payload:error.message});
  }
}

export const mainProductActions = {
  getProductList,
  changePage
};
