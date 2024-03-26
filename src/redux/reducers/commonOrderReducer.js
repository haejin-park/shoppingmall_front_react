// import * as types from '../../constants/order.constants';

const initialState = {
  loading: false,
  error: '',
  selectedOrder: {},
  order: {},
};

function commonOrderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    default: 
      return state; 
  }
}
export default commonOrderReducer;
