// src/components/HomeHeroWithBooking.jsx
import React from "react";
import BookingFormApp from "./BookingFormApp";

export default function HomeHeroWithBooking() {
  return (
    <section className="relative w-full py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-4">
        {/* En‑tête simple */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Votre trajet, version premium
          </h1>
          <p className="text-slate-600">
            Confort, discrétion et fiabilité
          </p>
        </div>

        {/* Plus de slider : seulement la carte du formulaire */}
        <div className="max-w-2xl mx-auto">
          <BookingFormApp embedded />
        </div>
      </div>
    </section>
  );
}
