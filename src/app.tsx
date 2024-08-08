import * as React from 'react';
import {createRoot} from 'react-dom/client';

import '../src/assets/style.css';

const App: React.FC = () => {
  return (
    <>
      <iframe
        src="https://www.rollfunkydice.com/room/regulatory-moccasin"
        style={{ height: "100%", width: "100%" }}
      ></iframe>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
