import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getMainProductList = (query) => async (dispatch) => {
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

const getAdminProductList = (query) => async (dispatch) => {
  try {
    dispatch({type:types.GET_ADMIN_PRODUCT_LIST_REQUEST});
    let options = {params: {...query}};
    const response = await api.get(`/product`, options);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.GET_ADMIN_PRODUCT_LIST_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.GET_ADMIN_PRODUCT_LIST_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const createProduct = (formData,latestStatus) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_PRODUCT_REQUEST});
    const response = await api.post("/product", formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 생성을 완료했습니다.", "success"));
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT, payload:1});    
    dispatch(productActions.getAdminProductList({searchKeyword: "", currentPage:1},latestStatus));
  } catch(error) {
    dispatch({type:types.CREATE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const deleteProduct = (id, query,latestStatus) => async (dispatch) => {
  try {
    if(!id) throw new Error('삭제하려는 상품의 ID가 존재하지 않습니다.');
    dispatch({type:types.DELETE_PRODUCT_REQUEST});
    await api.put(`/product/delete/${id}`);
    dispatch({type:types.DELETE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 삭제를 완료했습니다.", "success"));
    dispatch(productActions.getAdminProductList(query,latestStatus));
  } catch(error) {
    dispatch({type:types.DELETE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const updateProduct = (formData, query, latestStatus) => async (dispatch) => {
  try {
    dispatch({type:types.UPDATE_PRODUCT_REQUEST});
    const response = await api.put(`/product/${formData._id}`, formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.UPDATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 수정을 완료했습니다.", "success"));
    dispatch(productActions.getAdminProductList(query,latestStatus));
  } catch(error) {
    dispatch({type:types.UPDATE_PRODUCT_FAIL, payload:error.message});
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


export const productActions = {
  getMainProductList,
  getAdminProductList,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetail
};
