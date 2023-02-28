import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { Home } from "./components/Home";
import { Attendance } from "./components/Attendance";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Attendance" element={<Attendance />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
