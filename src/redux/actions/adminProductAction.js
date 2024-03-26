import * as types from '../../constants/product.constants';
import api from '../../utils/api';
import { commonUiActions } from './commonUiAction';

const getProductList = (query,sortBy) => async (dispatch) => {
  try {
    // console.log('adminProductAction query',query);
    dispatch({type:types.GET_ADMIN_PRODUCT_LIST_REQUEST});
    let options = {params: {...query}};
    if(sortBy === 'latest') options.params.sortBy = 'latest';
    if(sortBy === 'orderOfPurchase') options.params.sortBy = 'orderOfPurchase'; 
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
    dispatch(adminProductActions.changePage(1));
    await dispatch(adminProductActions.getProductList({searchKeyword: "", currentPage:1},latestStatus));
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
    await dispatch(adminProductActions.getProductList(query,latestStatus));
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
    await dispatch(adminProductActions.getProductList(query,latestStatus));
  } catch(error) {
    dispatch({type:types.UPDATE_PRODUCT_FAIL, payload:error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const changePage = (currentPage) => async(dispatch) => {
  try {
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT_REQUEST});
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT_SUCCESS, payload:currentPage});
  } catch(error) {
    dispatch({type:types.CHANGE_PAGE_OF_ADMIN_PRODUCT_FAIL, payload:error.message});
  }
}
/* 
각 페이지에서 페이지를 바꿔주는 미들웨어가 필요한건가? 
조회시 controller에서 skip할 document수 보다 작으면 설정할 수 있고
가져다 쓸 수 있게 페이지 상태를 스토어에서 관리하고 
페이지 상태는 useState로 초기값에 넣어준다음 
getProductLsit할 때만 업데이트해주면 되는거아닌가?
=> 뒤로가기 했을 때 이전 상태를 다시 업데이트 해주려면 필요할거같음 
*/

export const adminProductActions = {
  getProductList,
  createProduct,
  deleteProduct,
  updateProduct,
  changePage,
};
