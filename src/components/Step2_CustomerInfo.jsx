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
  const recaptchaRef = useRef();
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    nextStep();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{t.step2_title}</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">👤 {t.fullName}</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder={t.fullName}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">✉️ {t.email}</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.email}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">📞 {t.phone}</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t.phone}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">✈️ {t.flightNumber}</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={flightNumber}
            onChange={e => setFlightNumber(e.target.value)}
            placeholder={t.flightNumber}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">💬 {t.comment}</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t.comment}
            rows={3}
          />
        </div>

        <div className="my-6 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfuxpsrAAAAAOBCiuCu1rkWSmxrTpY4P9jAWwKf" // remplace par ta vraie clé
            onChange={token => {
              setCaptchaToken(token);
              setCaptchaError(false);
            }}
          />
        </div>
        {captchaError && (
          <div className="text-red-600 text-sm mb-2 text-center">
            {t.captchaError || "Veuillez valider le captcha"}
          </div>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            className="w-1/2 bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg shadow"
            onClick={prevStep}
          >
            {t.previous}
          </button>
          <button
            type="submit"
            className={`w-1/2 bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition ${!captchaToken ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={!captchaToken}
          >
            {t.next}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2_CustomerInfo;
