import React from "react";
import ReactDOM from "react-dom";
import Feed from "../components/Feed";

// Testing that Feed is able to render
it("Component Feed renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Feed />, div);
});
