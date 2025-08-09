import React from "react";

const Step3_Recap = ({
  t,
  tripType, departure, arrival, selectedHotel,
  departureDate, returnDate, passengers, childSeats, luggage, selectedVehicle,
  price, fullName, email, phone, flightNumber, comment,
  prevStep, sending, mailStatus, handleConfirm,
}) => (
  <div className="flex justify-center items-center min-h-screen bg-black">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t.step3_title || "Récapitulatif de la réservation"}</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{t.recapTrip || "📝 Trajet"}</h3>
        <p><b>{t.tripType || "Type"} :</b> {t[tripType] || tripType}</p>
        <p><b>{t.departure || "Départ"} :</b> {t[departure] || (departure && departure.charAt(0).toUpperCase() + departure.slice(1))}</p>
        <p><b>{t.arrival || "Arrivée"} :</b> {t[arrival] || (arrival && arrival.charAt(0).toUpperCase() + arrival.slice(1))}</p>
        {(departure === "disney" || arrival === "disney") && selectedHotel && (
          <p><b>{t.selectHotel || "Hôtel Disney"} :</b> {selectedHotel.label}</p>
        )}
        <p><b>{t.departureDate || "Date de départ"} :</b> {departureDate ? departureDate.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</p>
        {tripType === "round-trip" && (
          <p><b>{t.returnDate || "Date de retour"} :</b> {returnDate ? returnDate.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</p>
        )}
        <p><b>{t.passengers || "Passagers"} :</b> {passengers}</p>
        <p><b>{t.childSeats || "Sièges enfant"} :</b> {childSeats}</p>
        <p><b>{t.luggage || "Valises"} :</b> {luggage}</p>
        <p><b>{t.vehicleChoice || "Véhicule"} :</b> {selectedVehicle && t[selectedVehicle] ? t[selectedVehicle] : selectedVehicle}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{t.customerInfo || "👤 Client"}</h3>
        <p><b>{t.fullName || "Nom"} :</b> {fullName}</p>
        <p><b>{t.email || "Email"} :</b> {email}</p>
        <p><b>{t.phone || "Téléphone"} :</b> {phone}</p>
        {flightNumber && <p><b>{t.flightNumber || "Vol"} :</b> {flightNumber}</p>}
        {comment && <p><b>{t.comment || "Commentaire"} :</b> {comment}</p>}
      </div>

      <div className="mb-6 text-center text-green-600 font-bold text-lg">
        {t.estimatedPrice || "Prix total"} : {price ? `${price} €` : "--"}
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          className="w-1/2 bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg shadow"
          onClick={prevStep}
        >
          {t.previous || "Précédent"}
        </button>
        <button
          type="button"
          className={`w-1/2 bg-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-700 transition ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleConfirm}
          disabled={sending}
        >
          {sending ? (t.sending || "Envoi en cours...") : (t.confirmReservation || "Confirmer")}
        </button>
      </div>

      {/* Message de statut */}
      {mailStatus === "success" && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          {t.success || "Réservation confirmée !"}
        </div>
      )}
      {mailStatus === "error" && (
        <div className="mt-4 text-center text-red-600 font-semibold">
          {t.error || "Erreur lors de l'envoi, veuillez réessayer."}
        </div>
      )}
    </div>
  </div>
);

export default Step3_Recap;
