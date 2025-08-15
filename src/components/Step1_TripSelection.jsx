import React, { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { destinations } from "../data/destinations";
import { excursions } from "../data/excursions";

export default function Step1_TripSelection({
  t,
  tripType, setTripType,
  departure, setDeparture,
  arrival, setArrival,
  selectedHotel, setSelectedHotel,
  departureDate, setDepartureDate,
  returnDate, setReturnDate,
  price,
  hotelOptions,
  departureAddress, setDepartureAddress,
  arrivalAddress, setArrivalAddress,
  passengers, setPassengers,
  childSeats, setChildSeats,
  luggage, setLuggage,
  // ▼▼▼ NEW: Excursion
  selectedExcursion, setSelectedExcursion,
  // ▲▲▲
  nextStep,
  embedded = false,
}) {
  const isRoundTrip = tripType === "round-trip";
  const isDisney = departure === "disney" || arrival === "disney";

  // Options villes
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

  // Options excursions
  const excursionOptions = excursions.map(e => ({ value: e.value, label: e.label }));

  // Hôtel Disney par défaut
  const defaultDisneyHotel = useMemo(
    () => hotelOptions?.find(h => String(h.value).toLowerCase() === "disney_park"),
    [hotelOptions]
  );
  useEffect(() => {
    if (tripType !== "excursion" && isDisney && !selectedHotel && defaultDisneyHotel) {
      setSelectedHotel(defaultDisneyHotel);
    }
  }, [tripType, isDisney, selectedHotel, defaultDisneyHotel, setSelectedHotel]);

  // Règles
  const maxChildSeats = Math.max(0, passengers - 1);
  const canContinue =
    price != null &&
    (tripType === "excursion"
      ? !!selectedExcursion
      : (!isDisney || !!selectedHotel));

  // Styles react-select
  const selectStyles = {
    control: (base) => ({ ...base, minHeight: 38 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
  const selectCommonProps = {
    isSearchable: true,
    menuPortalTarget: typeof window !== "undefined" ? document.body : null,
    menuPosition: "fixed",
    styles: selectStyles,
  };

  // Bouton compteur
  const Btn = ({ onClick, disabled, children, aria }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      className={`h-8 w-8 rounded-full border bg-white hover:bg-slate-50 grid place-items-center text-[18px] leading-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      className="origin-top-left scale-[.75] w-[65%]"
      style={{ transformOrigin: "top left" }}
    >

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 min-h-[560px] flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4">{t.step1_title}</h2>

        {/* PILL SWITCH */}
        <div className="flex justify-center gap-2 mb-4" role="group" aria-label="Type de trajet">
          {[
            { id: "one-way", label: t.one_way },
            { id: "round-trip", label: t.round_trip },
            { id: "excursion", label: t.excursion },
          ].map(btn => (
            <button
              key={btn.id}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                tripType === btn.id ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700"
              }`}
              aria-pressed={tripType === btn.id}
              onClick={() => setTripType(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {tripType === "excursion" ? (
            // ========= MODE EXCURSION =========
            <>
              {/* Date & heure (pickup) */}
              <div>
                <label className="block text-sm font-semibold mb-1">📅 {t.departure_date || "Date & heure de départ"}</label>
                <DatePicker
                  selected={departureDate}
                  onChange={(d) => setDepartureDate(d)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Sélection Excursion */}
              <div>
                <label className="block text-sm font-semibold mb-1">🗺️ {t.excursion || "Excursion"}</label>
                <Select
                  {...selectCommonProps}
                  options={excursionOptions}
                  value={excursionOptions.find(x => x.value === selectedExcursion) || null}
                  onChange={(opt) => setSelectedExcursion(opt?.value || null)}
                  placeholder={t.selectExcursion || "Choisir une excursion…"}
                />
              </div>

              {/* Compteurs */}
              <div className="pt-1">
                <div className="flex items-center justify-between px-6">
                  {/* Passagers */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>🧍</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setPassengers(p => Math.max(1, p - 1))} aria="Diminuer passagers">–</Btn>
                      <span className="w-6 text-center select-none">{passengers}</span>
                      <Btn onClick={() => setPassengers(p => Math.min(16, p + 1))} aria="Augmenter passagers">+</Btn>
                    </div>
                  </div>

                  {/* Sièges enfant */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>👶</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setChildSeats(n => Math.max(0, n - 1))} disabled={childSeats <= 0} aria="Diminuer sièges enfant">–</Btn>
                      <span className="w-6 text-center select-none">{childSeats}</span>
                      <Btn onClick={() => setChildSeats(n => Math.min(maxChildSeats, n + 1))} disabled={childSeats >= maxChildSeats} aria="Augmenter sièges enfant">+</Btn>
                    </div>
                  </div>

                  {/* Valises */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>🧳</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setLuggage(n => Math.max(0, n - 1))} disabled={luggage <= 0} aria="Diminuer valises">–</Btn>
                      <span className="w-6 text-center select-none">{luggage}</span>
                      <Btn onClick={() => setLuggage(n => n + 1)} aria="Augmenter valises">+</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // ======= MODE TRAJET CLASSIQUE =======
            <>
              {/* Dates */}
              <div className={`grid grid-cols-1 ${isRoundTrip ? "md:grid-cols-2 md:gap-3" : ""}`}>
                <div>
                  <label className="block text-sm font-semibold mb-1">📅 {t.departure_date || "Date de départ"}</label>
                  <DatePicker
                    selected={departureDate}
                    onChange={(d) => setDepartureDate(d)}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    minDate={new Date()}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {isRoundTrip && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">📅 {t.return_date || "Date de retour"}</label>
                    <DatePicker
                      selected={returnDate}
                      onChange={(d) => setReturnDate(d)}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      minDate={departureDate || new Date()}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>

              {/* Départ */}
              <div>
                <label className="block text-sm font-semibold mb-1">🚩 {t.departure}</label>
                <Select
                  {...selectCommonProps}
                  options={departureOptions}
                  value={destinations.find(opt => opt.value === departure)}
                  onChange={(opt) => setDeparture(opt?.value || "")}
                  placeholder="Sélectionnez la ville de départ"
                />
              </div>
              {departure === "paris" && (
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={departureAddress}
                  onChange={(e) => setDepartureAddress(e.target.value)}
                  placeholder={t.address_placeholder || "Indiquez votre adresse"}
                  required
                />
              )}

              {/* Arrivée */}
              <div>
                <label className="block text-sm font-semibold mb-1">🏁 {t.arrival}</label>
                <Select
                  {...selectCommonProps}
                  options={arrivalOptions}
                  value={destinations.find(opt => opt.value === arrival)}
                  onChange={(opt) => setArrival(opt?.value || "")}
                  placeholder="Sélectionnez la ville d'arrivée"
                />
              </div>
              {arrival === "paris" && (
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={arrivalAddress}
                  onChange={(e) => setArrivalAddress(e.target.value)}
                  placeholder={t.address_placeholder || "Indiquez votre adresse"}
                  required
                />
              )}

              {/* Hôtel Disney (si Disney) */}
              {isDisney && (
                <div>
                  <label className="block text-sm font-semibold mb-1">🏨 {t.selectHotel || "Choisissez votre hôtel à Disney"}</label>
                  <Select
                    {...selectCommonProps}
                    options={hotelOptions}
                    value={selectedHotel}
                    onChange={setSelectedHotel}
                    isClearable={false}
                    placeholder={t.hotelPlaceholder || "Sélectionner un hôtel…"}
                  />
                  {!selectedHotel && (
                    <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire.</p>
                  )}
                </div>
              )}

              {/* Compteurs */}
              <div className="pt-1">
                <div className="flex items-center justify-between px-6">
                  {/* Passagers */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>🧍</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setPassengers(p => Math.max(1, p - 1))} aria="Diminuer passagers">–</Btn>
                      <span className="w-6 text-center select-none">{passengers}</span>
                      <Btn onClick={() => setPassengers(p => Math.min(16, p + 1))} aria="Augmenter passagers">+</Btn>
                    </div>
                  </div>

                  {/* Sièges enfant */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>👶</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setChildSeats(n => Math.max(0, n - 1))} disabled={childSeats <= 0} aria="Diminuer sièges enfant">–</Btn>
                      <span className="w-6 text-center select-none">{childSeats}</span>
                      <Btn onClick={() => setChildSeats(n => Math.min(maxChildSeats, n + 1))} disabled={childSeats >= maxChildSeats} aria="Augmenter sièges enfant">+</Btn>
                    </div>
                  </div>

                  {/* Valises */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl" aria-hidden>🧳</span>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Btn onClick={() => setLuggage(n => Math.max(0, n - 1))} disabled={luggage <= 0} aria="Diminuer valises">–</Btn>
                      <span className="w-6 text-center select-none">{luggage}</span>
                      <Btn onClick={() => setLuggage(n => n + 1)} aria="Augmenter valises">+</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
              <div className="text-sm text-emerald-700/90 font-medium">{t.estimatedPrice || "Prix estimé"}</div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {price != null ? `${price} €` : "--"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { if (canContinue) nextStep(); }}
            className="h-12 px-6 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 active:translate-y-[1px] transition disabled:opacity-60"
            disabled={!canContinue}
          >
            {t.next || "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
