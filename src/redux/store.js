import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import mainProductReducer from "./reducers/mainProductReducer";
import adminProductReducer from "./reducers/adminProductReducer";
import commonProductReducer from "./reducers/commonProductReducer";
import cartReducer from "./reducers/cartReducer";
import commonUiReducer from "./reducers/commonUIReducer";
import orderReducer from "./reducers/orderReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    mainProduct: mainProductReducer,
    adminProduct: adminProductReducer,
    commonProduct: commonProductReducer,
    cart: cartReducer,
    ui: commonUiReducer,
    order: orderReducer,
  },
});
export default store;
