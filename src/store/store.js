import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from './counterSlice'
import studentslice from "./studentSlice";
import facultiesSlice from "./facultiesSlice";

export const store = configureStore({
  reducer: {
    students: studentslice,
    teachers: facultiesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import studentslice from "./studentSlice";
// import facultiesSlice from "./facultiesSlice";

// // Create a persist configuration for each slice you want to persist
// const persistConfig = {
//   key: 'root',
//   storage,
//   // You can blacklist specific reducers here if you don't want them to persist
//   // blacklist: ['someReducer']
//   // Or whitelist specific reducers to persist
//   // whitelist: ['students', 'teachers']
// };

// const rootReducer =combineReducers({
//   students: studentslice,
//   teachers: facultiesSlice,
// });
// // Persist the rootReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// // Create a persistor for the store
// export const persistor = persistStore(store);

