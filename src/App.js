import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import ProtectedRoute from "./Component/ProtectedRoute";
import Mainpage from "./Mainpage";
import "./App.css"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/Mainpage"
          element={
            <ProtectedRoute>
              <Mainpage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
