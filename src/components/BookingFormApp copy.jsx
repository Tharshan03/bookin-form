import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tarifsVtc } from "../data/tarifsVtc";
import translations from "../translations";
import Select from "react-select";



const BookingFormApp = () => {
  const lang = document.documentElement.lang?.substring(0, 2).toLowerCase() || "fr";
  const t = { ...translations.fr, ...translations[lang] };
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState("one-way");
  const [departure, setDeparture] = useState("cdg");
  const [arrival, setArrival] = useState("disney");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [childSeats, setChildSeats] = useState(0);
  const [luggage, setLuggage] = useState(0);
  const [price, setPrice] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("mercedes");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [comment, setComment] = useState(""); // ✅ à ajouter ici

  const [sending, setSending] = useState(false);      // ✅ ajouté
  const [mailStatus, setMailStatus] = useState("");   // ✅ ajouté

const vehicleImages = {
  mercedes: "/booking-taxi/images/mercedes.jpg",
  van_standard: "/booking-taxi/images/van_standard.jpg",
  van_vito: "/booking-taxi/images/van_vito.jpg",
};

  const vehicleOptions = [
    { id: "mercedes", name: "Mercedes Classe E", extra: 0 },
    { id: "van_standard", name: "Van Standard", extra: 10 },
    { id: "van_vito", name: "Van Vito Premium", extra: 20 },
  ];

  const hotelOptions = [
      { value: "bb_bussy", label: "B&B Bussy St Georges" },
      { value: "bb_val_france", label: "Hotel B&B Val de France Disney" },
      { value: "best_western_bussy", label: "Best western Bussy St Georges" },
      { value: "campanile_bussy", label: "Campanile Bussy St Georges" },
      { value: "campanile_torcy", label: "Campanile Torcy" },
      { value: "chessy_gare", label: "Chessy Gare" },
      { value: "citéa_bussy", label: "Citéa Bussy St Georges" },
      { value: "dali", label: "Hotel Dali" },
      { value: "disney_park", label: "Disneyland paris (Park)" },
      { value: "explorers", label: "Hotel Explorers" },
      { value: "gare_mlv", label: "Gare Marne la Vallée" },
      { value: "grand_magic", label: "Grand Magic Hotel" },
      { value: "hotel_cheyenne", label: "Disney's hotel Cheyenne" },
      { value: "hotel_marvel", label: "Disney's hotel Marvel Newyork" },
      { value: "hotel_newport", label: "Disney's hotel Newport Bay Club" },
      { value: "hotel_santa_fe", label: "Disney's hotel Santa Fe" },
      { value: "hotel_sequoia", label: "Disney's hotel Sequoia Lodge" },
      { value: "ibis_val_europe", label: "Ibis Val d'Europe" },
      { value: "moxy", label: "Hotel Moxy Val d'Europe" },
      { value: "others", label: "Others" },
      { value: "paxton", label: "Paxton Ferrière" },
      { value: "radisson_blu", label: "Radisson Blu" },
      { value: "relais_spa", label: "Relais SPA" },
      { value: "residhome", label: "Resid'home" },
      { value: "séjours_affaires", label: "Séjours Affaires Apparthotel" },
      { value: "serris_gare", label: "Serris Gare" },
      { value: "stay_city", label: "Stay city Marne la Vallée" },
      { value: "val_d_europe", label: "Val d'Europe shopping center" },
      { value: "vallée_village", label: "Vallée Village" },
      { value: "vienna", label: "Vienna House Dream Castle Paris" },
      { value: "village_nature", label: "Village Nature" }
    ];

  const filteredVehicles = passengers <= 4
    ? vehicleOptions.filter(v => v.id !== "van_vito")
    : vehicleOptions.filter(v => v.id !== "mercedes");

  useEffect(() => {
    const now = new Date();
    const jPlus2 = new Date(now);
    const jPlus7 = new Date(now);
    jPlus2.setDate(jPlus2.getDate() + 2);
    jPlus7.setDate(jPlus7.getDate() + 7);

    setDepartureDate(jPlus2);
    if (tripType === "round-trip") setReturnDate(jPlus7);
  }, [tripType]);

  useEffect(() => {
    if (passengers <= 4) {
      setSelectedVehicle("mercedes");
    } else {
      setSelectedVehicle("van_standard");
    }
  }, [passengers]);

  useEffect(() => {
    if (departure && arrival && departure !== arrival) {
      const baseKey = `${departure.toLowerCase()}-${arrival.toLowerCase()}`;
      const fullKey = tripType === "round-trip" ? `${baseKey}-${departure.toLowerCase()}` : baseKey;
      const tarifsData = tarifsVtc[tripType];
      if (tarifsData && tarifsData[fullKey]) {
        const basePrice = tarifsData[fullKey][passengers - 1];
        const selectedExtra = vehicleOptions.find(v => v.id === selectedVehicle)?.extra || 0;
        setPrice(basePrice + selectedExtra);
      } else {
        setPrice(null);
      }
    } else {
      setPrice(null);
    }
  }, [departure, arrival, tripType, passengers, selectedVehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleConfirm = () => {
    setSending(true);           // 🟡 Affiche le message "en cours"
    setMailStatus("");          // Réinitialise le message

    const payload = {
      fullName,
      email,
      phone,
      flightNumber,
      comment,
      departure,
      arrival,
      departureDate: departureDate.toLocaleString(),
      returnDate: returnDate ? returnDate.toLocaleString() : "",
      passengers,
      childSeats,
      luggage,
      vehicle: selectedVehicle,
      price,
      tripType,
    };

    fetch("https://parisairportdisneyprestigetransfer.fr/booking-taxi/send-mail.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);
        if (data.status === "success") {
          setMailStatus("success");
          window.location.href = "/booking-taxi/confirmation.html";
        } else {
          setMailStatus("error");
        }
      })
      .catch((err) => {
        setSending(false);
        setMailStatus("error");
      });
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
           {t.bookingTitle}
        </h2>

            {step === 1 && (
            <>
              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-l ${tripType === "one-way" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setTripType("one-way")}
                >
                  {t.oneWay}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border-t border-b ${tripType === "round-trip" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setTripType("round-trip")}
                >
                  {t.roundTrip}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-r ${tripType === "excursion" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setTripType("excursion")}
                >
                  Excursion
                </button>
              </div>


              <div className="mb-4">
                <label className="block font-medium mb-1">📅 {t.departureDate}</label>
                <DatePicker
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="Pp"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {tripType === "round-trip" && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">📅 {t.returnDate}</label>
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}

                <div className="mb-4">
                  <label className="block font-medium mb-1">🚩 {t.departure}</label>
                  <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option value="paris">Paris</option>
                    <option value="cdg">CDG</option>
                    <option value="orly">Orly</option>
                    <option value="disney">Disney</option>
                    <option value="beauvais">Beauvais</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-1">🏁 {t.arrival}</label>
                  <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option value="paris">Paris</option>
                    <option value="cdg">CDG</option>
                    <option value="orly">Orly</option>
                    <option value="disney">Disney</option>
                    <option value="beauvais">Beauvais</option>
                  </select>
                </div>

              {(departure === "disney" || arrival === "disney") && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">🏨 {t.selectHotel}</label>
                  <Select
                    options={hotelOptions}
                    value={selectedHotel}   
                    onChange={(option) => setSelectedHotel(option)}
                    isClearable
                    placeholder={t.hotelPlaceholder}
                  />
                </div>
              )}

              <div className="mb-4">
                <label>👤 {passengers} {t.passengers}</label>
                  <input type="range" min="1" max="16" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="w-full" />
              </div>

              <div className="mb-4">
                <label>👶 {childSeats} {t.childSeats}</label>
                <input type="range" min="0" max={Math.max(0, passengers - 1)} value={childSeats} onChange={(e) => setChildSeats(Number(e.target.value))} className="w-full" />
              </div>

              <div className="mb-4">
                <label>💼 {luggage} {t.luggage}</label>
                <input type="range" min="0" max="14" value={luggage} onChange={(e) => setLuggage(Number(e.target.value))} className="w-full" />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">🚗 {t.vehicleChoice}</label>
                <div className="flex space-x-4 justify-center">
                  {filteredVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`cursor-pointer border-2 rounded-lg p-1 ${selectedVehicle === vehicle.id ? "border-blue-500" : "border-transparent"}`}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <img src={vehicleImages[vehicle.id]} alt={vehicle.name} className="h-16 w-24 object-cover" />
                      <p className="text-sm text-center mt-1">{vehicle.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {price !== null && (
                <div className="mb-4 text-center text-green-600 font-semibold">
                  {t.estimatedPrice} : {price} €
                </div>
              )}

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                {t.reserve}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label>{t.fullName}</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label>{t.email}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label>{t.phone}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label>{t.flightNumber}</label>
                <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                {t.continue}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-4">
                <h3 className="font-bold">{t.recap}</h3>
                <p><strong>{t.trip}:</strong> {departure} → {arrival} ({tripType})</p>
                <p><strong>{t.departureDate}:</strong> {departureDate.toLocaleString()}</p>
                {tripType === "round-trip" && <p><strong>{t.returnDate}:</strong> {returnDate.toLocaleString()}</p>}
                <p><strong>Hôtel :</strong> {selectedHotel.label}</p>
                <p><strong>{t.passengers}:</strong> {passengers} / {t.childSeats}: {childSeats} / {t.luggage}: {luggage}</p>
                <p><strong>{t.vehicleChoice}:</strong> {selectedVehicle}</p>
                <p><strong>{t.estimatedPrice}:</strong> {price} €</p>
                <hr className="my-2" />
                <p><strong>{t.fullName}:</strong> {fullName}</p>
                <p><strong>{t.email}:</strong> {email}</p>
                <p><strong>{t.phone}:</strong> {phone}</p>
                <p><strong>{t.flightNumber}:</strong> {flightNumber}</p>
                {comment && <p><strong>{t.comment}:</strong> {comment}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="comment">
                  {t.comment}
                </label>
                <textarea
                  id="comment"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={t.comment}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {t.confirmReservation}
              </button>

              {sending && (
                <p className="text-blue-600 mt-2 text-center">{t.sending}</p>
              )}

              {mailStatus === "success" && (
                <p className="text-green-600 mt-2 text-center">{t.success}</p>
              )}

              {mailStatus === "error" && (
                <p className="text-red-600 mt-2 text-center">{t.error}</p>
              )}
            </>
          )}

      </form>
    </div>
  );
};

export default BookingFormApp;
