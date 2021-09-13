import React from "react";
import ReactDOM from "react-dom";
import App from "../app";

// Testing that App is able to render
it("Component App renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
