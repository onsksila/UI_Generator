import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InputVarList from "./InputVarList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:idevalcomp" element={<InputVarList />} />
      </Routes>
    </Router>
  );
}

export default App;
