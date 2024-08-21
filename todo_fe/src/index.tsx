import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom";
import Todo from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Todo title={""} status={false} />
  </React.StrictMode>,
  document.getElementById("root")
);
