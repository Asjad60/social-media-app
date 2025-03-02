import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import rootReducer from "./reducer/rootReducer.js";
import { configureStore } from "@reduxjs/toolkit";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./lib/Socket.jsx";

const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </SocketProvider>
  </Provider>
  // </StrictMode>
);
