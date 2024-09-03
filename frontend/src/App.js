import logo from './logo.svg';
import './App.css';
import * as React from "react";
import * as ReactDOM from "react-dom/client"
import { Route, Routes } from "react-router-dom";
import Home from './Home';
import Upload from './UploadPage/Upload';
import Login from './loginPage/login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/upload' element={<Upload/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>

    </div>
  );
}

export default App;
