import { FC } from "react";

import LayoutWrap from "../components/Layout";
import Feed from "../components/Feed";

const App: FC = () => (
  <LayoutWrap>
    <Feed />
  </LayoutWrap>
);

export default App;
