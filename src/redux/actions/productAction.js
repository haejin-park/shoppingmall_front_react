import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';


const getProductList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_PRODUCT_LIST_REQUEST, payload: query});
    const response = await api.get(`/product`, {params: {...query}});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_PRODUCT_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_PRODUCT_LIST_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

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

const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_PRODUCT_REQUEST});
    const response = await api.post("/product", {formData});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 생성을 완료했습니다.", "success"));
  } catch(error) {
    dispatch({type:types.CREATE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {};

const searchProduct = (searchQuery) => async(dispatch) => {
  try {
    dispatch({type:types.SEARCH_PRODUCT_REQUEST})
    dispatch({type:types.SEARCH_PRODUCT_SUCCESS, payload:searchQuery});
  } catch(error) {
    dispatch({type:types.SEARCH_PRODUCT_FAIL, paryload:error.message});
  }
};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
  searchProduct
};
