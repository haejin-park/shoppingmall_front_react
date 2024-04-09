import api from '../../utils/api';
import * as types from '../../constants/user.constants';
import { commonUiActions } from './commonUiAction';

const loginWithToken = (user) => async (dispatch) => {
  try {
    dispatch({type:types.LOGIN_WITH_TOKEN_REQUEST});
    const response = await api.get("/user/me");
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type: types.LOGIN_WITH_TOKEN_SUCCESS, payload: response.data});
  } catch(error) {
    dispatch({type: types.LOGIN_WITH_TOKEN_FAIL, payload: error.message});
    dispatch(logout(user.email));
  }
};

const loginWithEmail = (email, password, navigate) => async (dispatch) => {
  try {
    dispatch({type:types.LOGIN_REQUEST});
    const response = await api.post('/auth/login', {email, password});
    if(response.status !== 200) throw new Error(response.message);
    sessionStorage.setItem("currentUserEmail", email);
    const prevUserEmail = sessionStorage.getItem("prevUserEmail");
    email === prevUserEmail ? navigate(-1) : navigate('/');
    dispatch({type: types.LOGIN_SUCCESS, payload: response.data});
    sessionStorage.setItem("token", response.data.token);
    api.defaults.headers.authorization = `Bearer ${response.data.token}`;
    dispatch(commonUiActions.showToastMessage("로그인 되었습니다.", "success"));
    sessionStorage.removeItem("prevUserEmail");
    sessionStorage.removeItem("currentUserEmail");
  } catch(error) {
    dispatch({type: types.LOGIN_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const logout = (email) => async (dispatch) => {  
  sessionStorage.setItem('prevUserEmail', email);
  sessionStorage.removeItem("token");
  dispatch(commonUiActions.showToastMessage("로그아웃 되었습니다.", "success"));
  dispatch({type: types.LOGOUT});
};

const loginWithGoogle = ({googleToken}, navigate) => async (dispatch) => {
  try {
    dispatch({type: types.GOOGLE_LOGIN_REQUEST});
    const response = await api.post('/auth/google', {googleToken});
    if(response.status !== 200) throw new Error(response.message);
    const prevUserEmail = sessionStorage.getItem("prevUserEmail");
    sessionStorage.setItem("currentUserEmail", response.data.user.email);
    response.data.user.email === prevUserEmail ? navigate(-1) : navigate('/');
    dispatch({type: types.GOOGLE_LOGIN_SUCCESS, payload: response.data});
    sessionStorage.setItem('token', response.data.token);
    api.defaults.headers.authorization = `Bearer ${response.data.token}`;
    dispatch(commonUiActions.showToastMessage("로그인 되었습니다.", "success"));
    sessionStorage.removeItem("prevUserEmail");
    sessionStorage.removeItem("currentUserEmail");
  } catch (error) {
    dispatch({type: types.GOOGLE_LOGIN_FAIL, payload: error.message});
    dispatch(commonUiActions.showToastMessage(error.message, "error"));
  }
};

const registerUser = (email, name, password, navigate) => async (dispatch) => {
  try {
    dispatch({type: types.REGISTER_USER_REQUEST});
    const response = await api.post('/user', {email, name, password});
    if(response.status !== 200) throw new Error(response.message);
    dispatch({type: types.REGISTER_USER_SUCCESS});
    dispatch(commonUiActions.showToastMessage("회원가입을 완료했습니다.", "success"));
    navigate('/login');
  } catch(error) {
    dispatch({type: types.REGISTER_USER_FAIL});
  }
};

export const userActions = {
  loginWithToken,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerUser,
};
