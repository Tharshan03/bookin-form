import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingFormApp from "./BookingFormApp"; // ← ajuste le chemin selon ton projet

/**
 * Hero 2 colonnes ultra-flexible pour ta Home :
 * - Colonne A : BookingFormApp
 * - Colonne B : média (slider d'images ET/OU vidéo)
 *
 * ✅ Props clés
 *   - reverse       : inverse la position (formulaire à droite, média à gauche)
 *   - theme         : "dark" | "light"
 *   - mediaItems    : [{ type: 'image'|'video', src: string, alt?: string }]
 *   - autoplayMs    : intervalle de rotation (ms)
 *
 * Exemples d'usage (voir en bas du fichier) :
 *   <HomeHero
 *     reverse
 *     theme="dark"
 *     mediaItems={[
 *       { type:'image', src:'/images/mercedes.jpg', alt:'Mercedes Classe E' },
 *       { type:'image', src:'/images/van_standard.jpg', alt:'Van Standard' },
 *       { type:'video', src:'/videos/hero-car.mp4' },
 *     ]}
 *   />
 */

export default function HomeHero({
  reverse = false,
  theme = "dark",
  autoplayMs = 4000,
  mediaItems = [
    { type: "image", src: "/images/mercedes.jpg", alt: "Mercedes Classe E" },
    { type: "image", src: "/images/van_standard.jpg", alt: "Van Standard" },
    { type: "image", src: "/images/van_vito.jpg", alt: "Van Vito Premium" },
  ],
}) {
  return (
    <section className={
      "relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden " +
      (theme === "light" ? "bg-gradient-to-b from-white to-slate-50" : "bg-neutral-950")
    }>
      {/* Arrière-plan décoratif */}
      <Background theme={theme} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch ${reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}>
          {/* Colonne Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={
              theme === "light"
                ? "bg-white rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8"
                : "bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/40 p-4 sm:p-6 lg:p-8"
            }
          >
            <BookingFormApp />
          </motion.div>

          {/* Colonne Média */}
          <MediaPanel theme={theme} items={mediaItems} autoplayMs={autoplayMs} />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Sous-composants ---------------------------- */
function Background({ theme }) {
  if (theme === "light") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
    </div>
  );
}

function MediaPanel({ theme, items, autoplayMs }) {
  const [isPaused, setIsPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % items.length), autoplayMs);
    return () => clearInterval(timerRef.current);
  }, [isPaused, items.length, autoplayMs, hasMultiple]);

  const prev = () => setIndex(i => (i - 1 + items.length) % items.length);
  const next = () => setIndex(i => (i + 1) % items.length);

  const isLight = theme === "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={
        "relative rounded-3xl overflow-hidden shadow-2xl border " +
        (isLight ? "border-slate-200 bg-white" : "border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800")
      }
    >
      {/* Header */}
      <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-5 ${isLight ? "text-slate-900" : "text-white/90"}`}>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Votre trajet, version premium</h2>
          <p className={`text-xs sm:text-sm ${isLight ? "text-slate-500" : "text-white/70"}`}>Confort, discrétion et fiabilité</p>
        </div>
        {hasMultiple && (
          <div className="flex gap-2">
            <button onClick={prev} className={`h-9 w-9 rounded-full ${isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-white/15 hover:bg-white/25"} transition grid place-items-center`} aria-label="Slide précédent">‹</button>
            <button onClick={next} className={`h-9 w-9 rounded-full ${isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-white/15 hover:bg-white/25"} transition grid place-items-center`} aria-label="Slide suivant">›</button>
          </div>
        )}
      </div>

      {/* Zone média */}
      <div className="relative h-[360px] sm:h-[420px] md:h-[520px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <AnimatePresence mode="popLayout">
          <MediaItem key={index} item={items[index]} theme={theme} />
        </AnimatePresence>

        {/* Overlay lisibilité */}
        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-t from-white/70 via-white/10 to-transparent" : "bg-gradient-to-t from-black/60 via-black/20 to-transparent"}`} />

        {/* Légende */}
        {items[index].alt && (
          <div className={`absolute bottom-4 left-4 right-4 ${isLight ? "text-slate-900" : "text-white"} drop-shadow-lg`}>
            <div className={`inline-flex items-center gap-2 rounded-full ${isLight ? "bg-white/70" : "bg-white/10"} px-3 py-1 text-xs sm:text-sm backdrop-blur`}>
              <span className={`h-2 w-2 rounded-full ${isLight ? "bg-emerald-500" : "bg-emerald-400"}`} />
              {items[index].alt}
            </div>
          </div>
        )}
      </div>

      {/* Bullets */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Aller au média ${i + 1}`} className={`h-2.5 rounded-full transition-all ${i === index ? (isLight ? "w-8 bg-slate-800" : "w-8 bg-white") : (isLight ? "w-2.5 bg-slate-400 hover:bg-slate-500" : "w-2.5 bg-white/50 hover:bg-white/70")}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MediaItem({ item, theme }) {
  const base = {
    className: "absolute inset-0 w-full h-full object-cover",
    initial: { opacity: 0, scale: 1.03 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  if (item.type === "video") {
    return (
      <motion.video
        key={`video-${item.src}`}
        src={item.src}
        autoPlay
        playsInline
        muted
        loop
        {...base}
      />
    );
  }
  // image par défaut
  return (
    <motion.img
      key={`img-${item.src}`}
      src={item.src}
      alt={item.alt || ""}
      {...base}
    />
  );
}

/* ------------------------------- Exemples -------------------------------- */
export function ExampleDarkReversed() {
  return (
    <HomeHero
      reverse
      theme="dark"
      mediaItems={[
        { type: "image", src: "/images/van_vito.jpg", alt: "Van Vito Premium" },
        { type: "image", src: "/images/mercedes.jpg", alt: "Mercedes Classe E" },
        { type: "video", src: "/videos/hero-car.mp4" },
      ]}
    />
  );
}

export function ExampleLight() {
  return (
    <HomeHero
      theme="light"
      mediaItems={[
        { type: "image", src: "/images/mercedes.jpg", alt: "Mercedes Classe E" },
        { type: "image", src: "/images/van_standard.jpg", alt: "Van Standard" },
      ]}
    />
  );
}
