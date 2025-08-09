import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { destinations } from "../data/destinations";
import { excursions } from "../data/excursions";
import "react-datepicker/dist/react-datepicker.css";


function getExcursionPrice(excursion, passengers) {
  if (!excursion) return null;
  if (passengers <= 4) return excursion.prices["1-4"];
  if (passengers <= 8) return excursion.prices["5-8"];
  if (passengers <= 12) return excursion.prices["9-12"];
  return excursion.prices["13-16"];
}


const Step1_TripSelection = ({
  t,
  tripType, setTripType,
  departure, setDeparture,
  arrival, setArrival,
  selectedHotel, setSelectedHotel,
  departureDate, setDepartureDate,
  returnDate, setReturnDate,
  passengers, setPassengers,
  childSeats, setChildSeats,
  luggage, setLuggage,
  selectedVehicle, setSelectedVehicle,
  price,
  nextStep,
  hotelOptions,
  filteredVehicles,
  vehicleImages,
  // Ajoutés :
  selectedExcursion, setSelectedExcursion,
  departureAddress, setDepartureAddress,
  arrivalAddress, setArrivalAddress,
}) => {

  // Groupes villes pour selects
  const departureOptions = [
    { label: "France", options: destinations.filter(d => d.country === "France" && d.value !== arrival) },
    { label: "Belgique", options: destinations.filter(d => d.country === "Belgique" && d.value !== arrival) },
    { label: "Pays-Bas", options: destinations.filter(d => d.country === "Pays-Bas" && d.value !== arrival) },
  ];
  const arrivalOptions = [
    { label: "France", options: destinations.filter(d => d.country === "France" && d.value !== departure) },
    { label: "Belgique", options: destinations.filter(d => d.country === "Belgique" && d.value !== departure) },
    { label: "Pays-Bas", options: destinations.filter(d => d.country === "Pays-Bas" && d.value !== departure) },
  ];

  // --- Rendu ---
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
        onSubmit={e => { e.preventDefault(); nextStep(); }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{t.step1_title}</h2>

        {/* Choix du type de trajet */}
        <div className="flex justify-center gap-2 mb-6">
          <button type="button"
            className={`px-4 py-2 rounded-lg font-semibold border transition ${tripType === "one-way" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setTripType("one-way")}>{t.one_way}</button>
          <button type="button"
            className={`px-4 py-2 rounded-lg font-semibold border transition ${tripType === "round-trip" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setTripType("round-trip")}>{t.round_trip}</button>
          <button type="button"
            className={`px-4 py-2 rounded-lg font-semibold border transition ${tripType === "excursion" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setTripType("excursion")}>{t.excursion}</button>
        </div>

        {/* Mode EXCURSION */}
        {tripType === "excursion" ? (
          <>
            <div className="mb-4">
              <label className="block font-semibold mb-1">🗺️ Excursion</label>
              <Select
                options={excursions.map(e => ({ value: e.value, label: e.label }))}
                value={excursions.find(e => e.value === selectedExcursion)}
                onChange={opt => setSelectedExcursion(opt.value)}
                placeholder="Sélectionnez une excursion"
                isSearchable
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">📅 {t.departureDate}</label>
              <DatePicker
                selected={departureDate}
                onChange={setDepartureDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="w-full border rounded px-3 py-2"
                placeholderText={t.departureDate}
              />
            </div>

            <div className="mb-4">
              <label className="font-semibold mb-1 flex items-center gap-2">
                <span>🧑</span> <span>{passengers} {t.passengers}</span>
              </label>
              <input
                type="range"
                min="1"
                max="16"
                value={passengers}
                onChange={e => setPassengers(Number(e.target.value))}
                className="w-full"
              />
            </div>

           <div className="mb-4">
            <label className="block font-semibold mb-1">🚗 {t.vehicleChoice}</label>
            <div className="grid grid-cols-1 gap-4 justify-center items-stretch mt-2">
              <div
                tabIndex={0}
                role="button"
                aria-pressed={true}
                className="
                  cursor-pointer bg-white rounded-2xl shadow-md p-3 border-2 flex flex-col items-center w-44
                  transition-all duration-200 outline-none 
                  border-blue-600 ring-2 ring-blue-200 scale-105 bg-blue-50
                "
                // Ici pas besoin d’onClick car un seul choix possible, mais tu peux le laisser si tu veux rendre ça réutilisable
              >
                {/* Image */}
                <div className="w-full h-28 flex items-center justify-center mb-2">
                  <img
                    src={vehicleImages["van_vito"]}
                    alt="Van Vito Premium"
                    className="object-contain h-24 w-auto transition-all duration-200"
                  />
                </div>
                {/* Nom véhicule */}
                <div className="font-semibold text-center text-lg mb-1">Van Vito Premium</div>
                {/* Infos véhicule */}
                <div className="text-xs text-gray-600 mb-1 text-center">
                  8 pers. max · Grand coffre
                </div>
              </div>
            </div>
          </div>


            {/* Prix de l’excursion */}
            {selectedExcursion && price !== null && (
              <div className="mb-4 text-center text-green-600 font-semibold text-lg">
                {t.estimatedPrice} : {price} €
              </div>
            )}


            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {t.reserve}
            </button>
          </>
        ) : (
          // Mode normal aller simple/aller-retour
          <>
            {/* Date de départ */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">📅 {t.departureDate}</label>
              <DatePicker
                selected={departureDate}
                onChange={setDepartureDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="w-full border rounded px-3 py-2"
                placeholderText={t.departureDate}
              />
            </div>
            {/* Date de retour (si round-trip) */}
            {tripType === "round-trip" && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">📅 {t.returnDate}</label>
                <DatePicker
                  selected={returnDate}
                  onChange={setReturnDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={departureDate}
                  className="w-full border rounded px-3 py-2"
                  placeholderText={t.returnDate}
                />
              </div>
            )}
              {/* Sélecteur de départ */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">🚩 {t.departure}</label>
                <Select
                  options={departureOptions}
                  value={destinations.find(opt => opt.value === departure)}
                  onChange={opt => setDeparture(opt.value)}
                  placeholder="Sélectionnez la ville de départ"
                  isSearchable
                />
              </div>

              {/* Champ d'adresse SI départ = Paris */}
              {departure === "paris" && (
                <div className="mb-4 flex items-center gap-2">
                  <span>📍</span>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={departureAddress}
                    onChange={e => setDepartureAddress(e.target.value)}
                    placeholder={t.address_placeholder || "Indiquez votre adresse"}
                    required
                  />
                </div>
              )}

              {/* Sélecteur d'arrivée */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">🏁 {t.arrival}</label>
                <Select
                  options={arrivalOptions}
                  value={destinations.find(opt => opt.value === arrival)}
                  onChange={opt => setArrival(opt.value)}
                  placeholder="Sélectionnez la ville d'arrivée"
                  isSearchable
                />
              </div>

              {/* Champ d'adresse SI arrivée = Paris */}
              {arrival === "paris" && (
                <div className="mb-4 flex items-center gap-2">
                  <span>📍</span>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={arrivalAddress}
                    onChange={e => setArrivalAddress(e.target.value)}
                    placeholder={t.address_placeholder || "Indiquez votre adresse"}
                    required
                  />
                </div>
              )}

              {/* Select hôtel Disney si besoin */}
              {(departure === "disney" || arrival === "disney") && (
                <div className="mb-4">
                  <label className="block font-semibold mb-1">🏨 {t.selectHotel}</label>
                  <Select
                    options={hotelOptions}
                    value={selectedHotel}
                    onChange={setSelectedHotel}
                    isClearable
                    placeholder={t.hotelPlaceholder}
                  />
                </div>
              )}

            {/* Passagers */}
            <div className="mb-4">
              <label className="font-semibold mb-1 flex items-center gap-2">
                <span>🧑</span> <span>{passengers} {t.passengers}</span>
              </label>
              <input
                type="range"
                min="1"
                max="16"
                value={passengers}
                onChange={e => setPassengers(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Siège enfant */}
            <div className="mb-4">
              <label className="font-semibold mb-1 flex items-center gap-2">
                <span>🍼</span> <span>{childSeats} {t.childSeats}</span>
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(0, passengers - 1)}
                value={childSeats}
                onChange={e => setChildSeats(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Valises */}
            <div className="mb-4">
              <label className="font-semibold mb-1 flex items-center gap-2">
                <span>🧳</span> <span>{luggage} {t.luggage}</span>
              </label>
              <input
                type="range"
                min="0"
                max="14"
                value={luggage}
                onChange={e => setLuggage(Number(e.target.value))}
                className="w-full"
              />
            </div>


            {/* Choix véhicule */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">🚗 {t.vehicleChoice}</label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-stretch mt-2">
                  {filteredVehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedVehicle === vehicle.id}
                      className={`
                        cursor-pointer bg-white rounded-2xl shadow-md p-3 border-2 flex flex-col items-center w-44
                        transition-all duration-200 outline-none 
                        ${selectedVehicle === vehicle.id ? "border-blue-600 ring-2 ring-blue-200 scale-105 bg-blue-50" : "border-gray-200"}
                        hover:shadow-lg hover:border-blue-400 hover:scale-105
                        focus:border-blue-600 focus:ring-2 focus:ring-blue-200
                      `}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedVehicle(vehicle.id);
                        }
                      }}
                    >
                      {/* Image */}
                      <div className="w-full h-28 flex items-center justify-center mb-2">
                        <img
                          src={vehicleImages[vehicle.id]}
                          alt={t[vehicle.id] || vehicle.name}
                          className="object-contain h-24 w-auto transition-all duration-200"
                        />
                      </div>
                      {/* Nom véhicule */}
                      <div className="font-semibold text-center text-lg mb-1">{t[vehicle.id] || vehicle.name}</div>
                      {/* Infos véhicule */}
                      <div className="text-xs text-gray-600 mb-1 text-center">
                        {vehicle.id === "mercedes" && <>4 pers. max · Climatisation</>}
                        {vehicle.id === "van_standard" && <>7 pers. max · Climatisation</>}
                        {vehicle.id === "van_vito" && <>8 pers. max · Grand coffre</>}
                      </div>
                      {/* Extra prix */}
                      {vehicle.id === "van_standard" && passengers <= 4 && (
                        <span className="mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                          +5 €
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>


            {price !== null ? (
              <div className="mb-4 text-center text-green-600 font-semibold text-lg">
                {t.estimatedPrice} : {price} €
              </div>
            ) : (
              <div className="mb-4 text-center text-orange-500 font-semibold text-lg">
                Le tarif vous sera communiqué par mail, continuez votre réservation.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {t.reserve}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Step1_TripSelection;
