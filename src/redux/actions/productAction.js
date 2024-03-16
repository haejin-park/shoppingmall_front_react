import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';


const getProductList = (query) => async (dispatch) => {
  try {
    console.log('query', query);
    dispatch({type:types.PRODUCT_GET_REQUEST, payload: query});
    const response = await api.get(`/product`, {params: {...query}});
    console.log('response', response);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.PRODUCT_GET_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.PRODUCT_GET_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
const getProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({type:types.PRODUCT_GET_DETAIL_REQUEST});
    const response = await api.get(`/product/${id}`);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.PRODUCT_GET_DETAIL_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.PRODUCT_GET_DETAIL_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({type:types.PRODUCT_CREATE_REQUEST});
    const response = await api.post("/product", {formData});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.PRODUCT_CREATE_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 생성 완료", "success"));
  } catch(error) {
    dispatch({type:types.PRODUCT_CREATE_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};
const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {

};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};
