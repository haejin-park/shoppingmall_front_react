import * as types from '../../constants/commonFn.constant';

const initialState = {
  loading: false,
  error: '',
  searchQuery: {},
  page: 1,
};

function commonFnReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case types.SEARCH_KEYWORD_REQUEST:
    case types.CHANGE_PAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }

    case types.SEARCH_KEYWORD_FAIL:
    case types.CHANGE_PAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }       

    case types.SEARCH_KEYWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        searchQuery: payload
      }      
      
    case types.CHANGE_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        page: payload
      }  
     

    default: 
      return state;  
  }
}

export default commonFnReducer;
