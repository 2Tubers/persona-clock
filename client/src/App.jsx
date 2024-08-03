import React from "react";
import Screen1 from "./Screen1";
import Background from "./Background";
import Alarm from "./Alarm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<><Screen1 /><Background/></>} />
          <Route path="/alarm" element={<> <Alarm /><Background/></>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
