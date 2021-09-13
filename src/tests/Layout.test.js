import React from "react";
import ReactDOM from "react-dom";
import LayoutWrap from "../components/Feed";

// Testing that Layout Wrapper Component is able to render
it("Component LayoutWrap renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LayoutWrap />, div);
});
