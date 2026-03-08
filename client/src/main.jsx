import React from 'react';
import ReactDOM from 'react-dom/client';
import { GeneralProvider } from './context/GeneralContext';
import App from './App';
import './index.css';

import { SocketProvider } from './context/SocketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GeneralProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GeneralProvider>
  </React.StrictMode>
);
