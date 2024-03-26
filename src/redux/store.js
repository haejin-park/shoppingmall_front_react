import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import mainProductReducer from "./reducers/mainProductReducer";
import adminProductReducer from "./reducers/adminProductReducer";
import commonProductReducer from "./reducers/commonProductReducer";
import cartReducer from "./reducers/cartReducer";
import commonUiReducer from "./reducers/commonUIReducer";
import myOrderReducer from "./reducers/myOrderReducer";
import adminOrderReducer from "./reducers/adminOrderReducer";
import commonOrderReducer from "./reducers/commonOrderReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    mainProduct: mainProductReducer,
    adminProduct: adminProductReducer,
    commonProduct: commonProductReducer,
    cart: cartReducer,
    ui: commonUiReducer,
    myOrder: myOrderReducer,
    adminOrder: adminOrderReducer,
    commonOrder: commonOrderReducer,
  },
});
export default store;
