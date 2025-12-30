import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LayoutWrap from '../components/Layout';
import Feed from '../components/Feed';
import Favorites from '../components/Favorites';

const App: FC = () => (
  <BrowserRouter>
    <LayoutWrap>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </LayoutWrap>
  </BrowserRouter>
);

export default App;
