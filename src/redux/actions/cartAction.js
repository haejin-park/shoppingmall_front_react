import * as types from '../../constants/cart.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const addToCart = ({ id, selectedOptionObj }) => async (dispatch) => {
  try {
    dispatch({type:types.ADD_TO_CART_REQUEST})
    const response = await api.post("/cart", {productId: id, selectedOptionObj});
    if(response.status !== 200) throw new Error(response.message);
    dispatch(commonUiActions.showToastMessage(response.data.message, "success"));
    dispatch({type:types.ADD_TO_CART_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type:types.ADD_TO_CART_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const getCartList = () => async (dispatch) => {
};
const deleteCartItem = (id) => async (dispatch) => {};

const updateQty = (id, value) => async (dispatch) => {};
const getCartQty = () => async (dispatch) => {};

const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_CART_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_CART_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_CART_FAIL, payload:error.message});
  }
}

export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  updateQty,
  getCartQty,
  changePage,
};
