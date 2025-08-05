import React from "react";
import { Routes, Route } from "react-router-dom";
import BookingFormApp from "./components/BookingFormApp";
import Tarifs from "./components/Tarifs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingFormApp />} />
      <Route path="/tarifs" element={<Tarifs />} />
    </Routes>
  );
}

export default App;
