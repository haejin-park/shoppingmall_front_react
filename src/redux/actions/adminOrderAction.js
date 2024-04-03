
import * as types from '../../constants/order.constants';

const getOrderList = (query) => async (dispatch) => {};
const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_MY_ORDER_FAIL, payload:error.message});
  }
}
export const adminOrderActions = {
  getOrderList,
  changePage,
};
