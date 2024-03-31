import './App.css';
import ChatApp from './pages/ChatApp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignUpForm';
import { GlobalProvider } from './components/GlobalContext';

function App() {
  return (
    <GlobalProvider>
    <BrowserRouter>
      <Routes>
          <Route path="/" element = {<LoginForm/>} />
          <Route path="/sign-up" element = {<SignUpForm/>}/>
          <Route path="/chat" element = {<ChatApp/>} />
      </Routes>
    </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
