// src/components/Step2_CustomerInfo.jsx
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Step2_CustomerInfo = ({
  t,
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  flightNumber, setFlightNumber,
  comment, setComment,
  prevStep, nextStep,
  captchaToken, setCaptchaToken,
}) => {
  const recaptchaRef = useRef(null);
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaToken) { setCaptchaError(true); return; }
    setCaptchaError(false);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Titre — identique Step1 */}
      <h2 className="text-xl font-bold mb-4 text-center">{t.step2_title}</h2>

      {/* Contenu — labels/inputs identiques Step1 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">👤 {t.fullName}</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder={t.fullName}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">✉️ {t.email}</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.email}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">📞 {t.phone}</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t.phone}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            ✈️ {t.flightNumber} <span className="text-xs text-slate-500">({t.optional || "optionnel"})</span>
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={flightNumber}
            onChange={e => setFlightNumber(e.target.value)}
            placeholder={t.flightNumber}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            💬 {t.comment} <span className="text-xs text-slate-500">({t.optional || "optionnel"})</span>
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t.comment}
            rows={3}
          />
        </div>

        {/* reCAPTCHA compact */}
        <div className="mt-2 flex justify-center">
          <div className="inline-block transform scale-90 origin-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LfuxpsrAAAAAOBCiuCu1rkWSmxrTpY4P9jAWwKf"
              size="compact"
              onChange={(token) => {
                setCaptchaToken(token);
                setCaptchaError(false);
              }}
            />
          </div>
        </div>

        {captchaError && (
          <div className="text-red-600 text-xs mt-1 text-center">
            {t.captchaError || "Veuillez valider le captcha"}
          </div>
        )}
      </div>

      {/* Footer — même style de boutons que Step1 */}
      <div className="flex justify-between gap-4 pt-3">
        <button
          type="button"
          className="h-12 px-6 rounded-xl bg-gray-100 text-gray-900 font-semibold shadow hover:bg-gray-200"
          onClick={prevStep}
        >
          {t.previous}
        </button>
        <button
          type="submit"
          className={`h-12 px-6 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 active:translate-y-[1px] transition ${!captchaToken ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!captchaToken}
        >
          {t.next}
        </button>
      </div>
    </form>
  );
};

export default Step2_CustomerInfo;
