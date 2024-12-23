// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddPet from "./components/AddPet";
import Mealtimes from "./components/Mealtime";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/mealtimes" element={<Mealtimes />} />
      </Routes>
    </Router>
  );
};

export default App;
