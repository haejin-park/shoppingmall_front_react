
const initialState = {
  loading: false,
  error: '',
  orderList: [],
  totalPageNum: 1,
};

function orderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    default: 
      return state; 
  }
}
export default orderReducer;
