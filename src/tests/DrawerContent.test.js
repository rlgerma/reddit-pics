import React from "react";
import ReactDOM from "react-dom";
import DrawerContent from "../components/DrawerContent";

// Testing that DrawerContent is able to render
it("Component DrawerContent renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<DrawerContent />, div);
});
