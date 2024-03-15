import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';


const getProductList = (query) => async (dispatch) => {};
const getProductDetail = (id) => async (dispatch) => {};

const createProduct = (formData) => async (dispatch) => {
  try {
    // console.log('formData', formData);
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
