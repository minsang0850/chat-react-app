import './App.css';
import ChatApp from './pages/ChatApp';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <ChatApp/>
    </BrowserRouter>
  );
}

export default App;
