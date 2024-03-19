import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import productReducer from "./reducers/productReducer";
import cartReducer from "./reducers/cartReducer";
import commonUiReducer from "./reducers/commonUIReducer";
import orderReducer from "./reducers/orderReducer";
import commonFnReducer from "./reducers/commonFnReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    ui: commonUiReducer,
    fn: commonFnReducer,
    order: orderReducer,
  },
});
export default store;
