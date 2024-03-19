import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';


const getProductList = (query) => async (dispatch) => {
  try {
    console.log('query', query);
    dispatch({type:types.GET_PRODUCT_LIST_REQUEST});
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

const createProduct = (formData, query) => async (dispatch) => {
  try {
    dispatch({type:types.CREATE_PRODUCT_REQUEST});
    const response = await api.post("/product", formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.CREATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 생성을 완료했습니다.", "success"));
    await dispatch(productActions.getProductList(query));
  } catch(error) {
    dispatch({type:types.CREATE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const deleteProduct = (id, query) => async (dispatch) => {
  try {
    if(!id) throw new Error('삭제하려는 상품의 ID가 존재하지 않습니다.');
    dispatch({type:types.DELETE_PRODUCT_REQUEST});
    await api.put(`/product/delete/${id}`);
    dispatch({type:types.DELETE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 삭제를 완료했습니다.", "success"));
    await dispatch(productActions.getProductList(query));
  } catch(error) {
    dispatch({type:types.DELETE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const updateProduct = (formData, query) => async (dispatch) => {
  try {
    dispatch({type:types.UPDATE_PRODUCT_REQUEST});
    const response = await api.put(`/product/${formData._id}`, formData);
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type:types.UPDATE_PRODUCT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 수정을 완료했습니다.", "success"));
    await dispatch(productActions.getProductList(query));
  } catch(error) {
    dispatch({type:types.UPDATE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const searchProduct = (searchQuery) => async(dispatch) => {
  try {
    dispatch({type:types.SEARCH_PRODUCT_REQUEST})
    dispatch({type:types.SEARCH_PRODUCT_SUCCESS, payload:searchQuery});
  } catch(error) {
    dispatch({type:types.SEARCH_PRODUCT_FAIL, paryload:error.message});
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
  searchProduct,
  selectProduct
};
