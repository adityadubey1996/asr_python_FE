import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Routing from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./store";
import './input.css'
import axios from "axios";
axios.defaults.withCredentials=true

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Routing />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
