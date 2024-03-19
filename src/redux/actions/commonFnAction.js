import * as types from '../../constants/commonFn.constant';

const searchKeyword = (searchQuery) => async(dispatch) => {
    try {
      dispatch({type:types.SEARCH_KEYWORD_REQUEST})
      dispatch({type:types.SEARCH_KEYWORD_SUCCESS, payload:searchQuery});
    } catch(error) {
      dispatch({type:types.SEARCH_KEYWORD_FAIL, paryload:error.message});
    }
  };
  const changePage = (page) => async(dispatch) => {
    try {
      console.log('product Action page', page);
      dispatch({type:types.CHANGE_PAGE_REQUEST});
      dispatch({type:types.CHANGE_PAGE_SUCCESS, payload:page});
    } catch(error) {
      dispatch({type:types.CHANGE_PAGE_FAIL, payload:error.message});
    }
  }

export const commonFnActions = {
    searchKeyword,
    changePage
  };
  