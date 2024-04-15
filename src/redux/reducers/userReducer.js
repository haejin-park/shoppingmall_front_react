
import * as types from '../../constants/user.constants';

const initialState = {
  loading: false,
  error: '',
  user: null,
  token: ''
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.REGISTER_USER_REQUEST:
    case types.LOGIN_REQUEST:
    case types.GOOGLE_LOGIN_REQUEST:
    case types.LOGIN_WITH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: ''
      }    

    case types.REGISTER_USER_FAIL:
    case types.LOGIN_FAIL:
    case types.GOOGLE_LOGIN_FAIL:
    case types.LOGIN_WITH_TOKEN_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      }  
        
    case types.REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: ''

      }

    case types.LOGIN_SUCCESS:
    case types.GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.user,
        token: payload.token
      }

    case types.LOGIN_WITH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        user: payload.user,
      }

    case types.LOGOUT:
      return {
        ...state,
        user: null,
        token: ''
      }    

      case types.DELETE_USER_ERROR:
        return {
          ...state,
          error: '',
        }
  
    
    default: 
      return state; 
  }
}

export default userReducer;
