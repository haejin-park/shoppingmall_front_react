import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonFnActions } from './commonFnAction';
import { commonUiActions } from './commonUiAction';

const getProductList = (query,latestStatus) => async (dispatch) => {
  try {
    dispatch({type:types.GET_PRODUCT_LIST_REQUEST});
    let options = {params: {...query}};
    if(latestStatus) options.params.latestStatus = true;
    const response = await api.get(`/product`, options);
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

const createProduct = (formData,latestStatus) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_PRODUCT_REQUEST});
    const response = await api.post("/product", formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 생성을 완료했습니다.", "success"));
    await dispatch(commonFnActions.changePage(1));
    await dispatch(productActions.getProductList({page:1, name: ""},latestStatus));
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
    await dispatch(productActions.getProductList(query,latestStatus));
  } catch(error) {
    dispatch({type:types.DELETE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const updateProduct = (formData, query,latestStatus) => async (dispatch) => {
  try {
    dispatch({type:types.UPDATE_PRODUCT_REQUEST});
    const response = await api.put(`/product/${formData._id}`, formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.UPDATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 수정을 완료했습니다.", "success"));
    await dispatch(productActions.getProductList(query,latestStatus));
  } catch(error) {
    dispatch({type:types.UPDATE_PRODUCT_FAIL, payload:error.message});
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

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetail,
  selectProduct,
};
