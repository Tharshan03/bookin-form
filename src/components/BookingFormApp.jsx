import React, { useState, useEffect } from "react";
import { tarifsVtc } from "../data/tarifsVtc";
import translations from "../translations";
import Step1_TripSelection from "./Step1_TripSelection";
import Step2_CustomerInfo from "./Step2_CustomerInfo";
import Step3_Recap from "./Step3_Recap";
import { excursions } from "../data/excursions";
import "react-datepicker/dist/react-datepicker.css";



const BookingFormApp = () => {
  const lang = document.documentElement.lang?.substring(0, 2).toLowerCase() || "fr";
  const t = { ...translations.fr, ...translations[lang] };

  // States principaux (gérés ici, passés aux Steps via props)
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState("one-way");
  const [departure, setDeparture] = useState("cdg");
  const [arrival, setArrival] = useState("disney");
  const [selectedExcursion, setSelectedExcursion] = useState("paris_4h");
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
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [mailStatus, setMailStatus] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  const [arrivalAddress, setArrivalAddress] = useState("");




  // Prix dynamique (exemple simplifié)
  useEffect(() => {
    // Calcule le prix ici selon tes règles, mets à jour setPrice(...)
    // setPrice(monCalcul());
  }, [tripType, departure, arrival, passengers, selectedVehicle, /* etc */]);

  // Handlers pour changement d’étape
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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

const vehicleOptions = [
  { id: "mercedes", name: "Mercedes Classe E", extra: 0 },
  { id: "van_standard", name: "Van Standard", extra: 5 },
  { id: "van_vito", name: "Van Vito Premium", extra: 0 },
];

const filteredVehicles = passengers <= 4
  ? vehicleOptions.filter(v => v.id !== "van_vito")
  : vehicleOptions.filter(v => v.id !== "mercedes");

const vehicleImages = {
  mercedes: "/images/mercedes.jpg",         // Vérifie que tes images sont bien dans /public/images/ !
  van_standard: "/images/van_standard.jpg",
  van_vito: "/images/van_vito.jpg",
};
/*
const handleConfirm = () => {
  setSending(true);
  setMailStatus("");
  console.log("handleConfirm called");
  // ... logistique d'envoi
};*/

// Si le type de trajet ou la date de départ change
useEffect(() => {
  if (tripType === "one-way") {
    // Pré-remplir la date de départ à J+3 (si pas déjà sélectionné par l'utilisateur)
    const todayPlus3 = new Date();
    todayPlus3.setDate(todayPlus3.getDate() + 3);
    // Change la date seulement si l'utilisateur n'a pas déjà choisi une date différente
    setDepartureDate(prev =>
      !prev || (prev && prev.toDateString() === new Date().toDateString())
        ? todayPlus3
        : prev
    );
    setReturnDate(null);
  }
  if (tripType === "round-trip") {
    // La date de retour = départ + 7 jours
    if (departureDate) {
      const retour = new Date(departureDate);
      retour.setDate(retour.getDate() + 7);
      setReturnDate(retour);
    }
  }
}, [tripType, departureDate]);

useEffect(() => {
  if (departure && arrival && departure !== arrival) {
    // Générer la clé tarifs
    const baseKey = `${departure.toLowerCase()}-${arrival.toLowerCase()}`;
    const fullKey = tripType === "round-trip"
      ? `${baseKey}-${departure.toLowerCase()}`
      : baseKey;
    const tarifsData = tarifsVtc[tripType];

    if (tarifsData && tarifsData[fullKey]) {
      const basePrice = tarifsData[fullKey][passengers - 1];

      // Extra véhicule : 5 € pour Van Standard si passagers ≤ 4, sinon 0
      let selectedExtra = 0;
      if (
        selectedVehicle === "van_standard" &&
        passengers <= 4
      ) {
        selectedExtra = 5;
      }
      setPrice(basePrice + selectedExtra);
    } else {
      setPrice(null);
    }
  } else {
    setPrice(null);
  }
}, [departure, arrival, tripType, passengers, selectedVehicle]);

useEffect(() => {
  if (tripType === "excursion" && selectedExcursion) {
    const excursionObj = excursions.find(e => e.value === selectedExcursion);
    setPrice(getExcursionPrice(excursionObj, passengers));
  } else {
    // ...calcul normal pour VTC classique
  }
}, [tripType, selectedExcursion, passengers, /* ...autres dépendances */]);



function getExcursionPrice(excursion, passengers) {
  if (!excursion) return null;
  if (passengers <= 4) return excursion.prices["1-4"];
  if (passengers <= 8) return excursion.prices["5-8"];
  if (passengers <= 12) return excursion.prices["9-12"];
  return excursion.prices["13-16"];
}

const handleConfirm = async () => {
  console.log("handleConfirm called");

  // ID unique pour la réservation (timestamp)
  const bookingId = Date.now().toString();

  // Données à envoyer au backend
  const bookingData = {
    id: bookingId,
    name: fullName, // ✅ renommé depuis fullName → name (attendu par PHP)
    email,
    phone,
    comment: comment || '',
    departure: departure,
    arrival: arrival,
    pickupDate: departureDate
      ? departureDate.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "",
    returnDate: returnDate
      ? returnDate.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "",
    flightNumber: flightNumber || '',
    passengers,
    childSeats,
    luggage,
    vehicle: selectedVehicle,
    price,
    tripType,
    lang,
    captchaToken,
    adminConfirmationLink: `https://parisairportdisneyprestigetransfer.fr/booking-taxi/confirm-mail.php?id=${bookingId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`
  };

  console.log("📦 Données envoyées au backend :", JSON.stringify(bookingData, null, 2));

  setSending(true);
  setMailStatus(null);

  try {
    // 1. Sauvegarde JSON côté serveur
    const saveRes = await fetch("/booking-taxi/save-booking.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });

    if (!saveRes.ok) throw new Error("Erreur d'enregistrement JSON");

    console.log("✅ Réservation sauvegardée");

    // 2. Envoi de l'e-mail au client + admin
    const mailRes = await fetch("/booking-taxi/send-mail.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });

    const result = await mailRes.json();
    console.log("📨 Réponse serveur mail :", result);

    if (result.status === "success") {
      setMailStatus("success");
    } else {
      throw new Error(result.message || "Erreur lors de l'envoi de l'e-mail.");
    }
  } catch (error) {
    console.error("❌ Erreur globale :", error);
    setMailStatus("error");
  }

  setSending(false);
};


  return (
    <div className="max-w-2xl mx-auto p-4">
      {step === 1 && (
        <Step1_TripSelection
        t={t}
        tripType={tripType}
        setTripType={setTripType}
        departure={departure}
        setDeparture={setDeparture}
        arrival={arrival}
        setArrival={setArrival}
        selectedHotel={selectedHotel}
        setSelectedHotel={setSelectedHotel}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        passengers={passengers}
        setPassengers={setPassengers}
        childSeats={childSeats}
        setChildSeats={setChildSeats}
        luggage={luggage}
        setLuggage={setLuggage}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        price={price}
        nextStep={() => setStep(2)}
        hotelOptions={hotelOptions}
        vehicleOptions={vehicleOptions}
        filteredVehicles={filteredVehicles}
        vehicleImages={vehicleImages}
        selectedExcursion={selectedExcursion}
        setSelectedExcursion={setSelectedExcursion}
        departureAddress={departureAddress}
        setDepartureAddress={setDepartureAddress}
        arrivalAddress={arrivalAddress}
        setArrivalAddress={setArrivalAddress}

        />
      )}

      {step === 2 && (
        <Step2_CustomerInfo
          t={t}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          flightNumber={flightNumber}
          setFlightNumber={setFlightNumber}
          comment={comment}
          setComment={setComment}
          prevStep={prevStep}
          nextStep={nextStep}
          captchaToken={captchaToken}
          setCaptchaToken={setCaptchaToken}
        />
      )}
      {step === 3 && (
        <Step3_Recap
          t={t}
          // Tous les champs du récap
          tripType={tripType}
          departure={departure}
          arrival={arrival}
          selectedHotel={selectedHotel}
          departureDate={departureDate}
          returnDate={returnDate}
          passengers={passengers}
          childSeats={childSeats}
          luggage={luggage}
          selectedVehicle={selectedVehicle}
          price={price}
          fullName={fullName}
          email={email}
          phone={phone}
          flightNumber={flightNumber}
          comment={comment}
          prevStep={prevStep}
          sending={sending}
          setSending={setSending}
          mailStatus={mailStatus}
          setMailStatus={setMailStatus}
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default BookingFormApp;
