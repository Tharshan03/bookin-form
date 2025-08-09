import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeHero from "./components/HomeHeroWithBooking";   // ⬅️ importe le hero
import Tarifs from "./components/Tarifs";
import "react-datepicker/dist/react-datepicker.css";

export default function App() {
  return (
    <Routes>
      {/* Home = Hero (form + slider) */}
      <Route
        path="/"
        element={
          <HomeHero
            reverse           // formulaire à droite, images à gauche. Retire-le pour l’inverse.
            theme="dark"      // "dark" ou "light"
            autoplayMs={4000}
            mediaItems={[
              { type: "image", src: "/images/van_vito.jpg", alt: "Van Vito Premium" },
              { type: "image", src: "/images/mercedes.jpg", alt: "Mercedes Classe E" },
              { type: "image", src: "/images/van_standard.jpg", alt: "Van Standard" },
              // { type: "video", src: "/videos/hero-car.mp4" }, // optionnel
            ]}
          />
        }
      />

      {/* Page tarifs (inchangé) */}
      <Route path="/tarifs" element={<Tarifs />} />

      {/* Optionnel : conserver l’ancien formulaire en page dédiée */}
      {/* <Route path="/booking" element={<BookingFormApp />} /> */}
    </Routes>
  );
}
