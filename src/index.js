import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { SnackbarProvider } from "notistack";
import FlagsProvider from "./components/Utils/FlagsProvider";
import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <FlagsProvider>
      <SnackbarProvider maxSnack={4}>
        <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <App />
          {/* </PersistGate> */}
        </Provider>
      </SnackbarProvider>
    </FlagsProvider>
  </BrowserRouter>

  // </React.StrictMode>
);
