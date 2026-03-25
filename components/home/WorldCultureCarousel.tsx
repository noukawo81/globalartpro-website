"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const cultureItems = [
  {
    label: "Afrique",
    image: "https://picsum.photos/id/1041/1200/800",
    alt: "Art africain",
  },
  {
    label: "Asie",
    image: "https://picsum.photos/id/1038/1200/800",
    alt: "Art asiatique",
  },
  {
    label: "Europe",
    image: "https://picsum.photos/id/1011/1200/800",
    alt: "Art européen",
  },
  {
    label: "Amériques",
    image: "https://picsum.photos/id/1016/1200/800",
    alt: "Art américain",
  },
];

export default function WorldCultureCarousel() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number>(0);
  const scrollStart = useRef<number>(0);
  const [parallax, setParallax] = useState(0);

  const loopingItems = useMemo(() => [...cultureItems, ...cultureItems], []);

  useEffect(() => {
    if (reduceMotion || !trackRef.current) return;

    let raf = 0;
    let previousTime = performance.now();
    const target = trackRef.current;
    const speed = 0.16;

    const tick = (time: number) => {
      if (!target) return;
      const delta = time - previousTime;
      previousTime = time;

      if (!isHover && !isDragging) {
        target.scrollLeft += delta * speed;
        if (target.scrollLeft >= target.scrollWidth / 2) {
          target.scrollLeft = 0;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHover, isDragging, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const winH = typeof window !== 'undefined' ? window.innerHeight : 0;
      const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
      setParallax(progress * 12);
    };

    // Only add listeners if window is available (client-side)
    if (typeof window !== 'undefined') {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [reduceMotion]);

  const onDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = event.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
    trackRef.current?.setPointerCapture(event.pointerId);
  };

  const onDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    const delta = dragStart.current - event.clientX;
    trackRef.current.scrollLeft = scrollStart.current + delta;
  };

  const onDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    trackRef.current?.releasePointerCapture(event.pointerId);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#02030a] py-16 px-4 sm:px-6 md:px-12"
      aria-label="Galerie des cultures du monde"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#04061b] to-transparent"
        style={{ transform: `translateY(${parallax * 0.4}px)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Un centre culturel mondial
        </motion.h2>
        <p className="mt-3 max-w-2xl text-base sm:text-lg text-gray-300">
          Baladez-vous à travers les continents avec des visuels exclusifs. Scrollez, faites glisser ou laissez le mouvement lent s’animer tout seul.
        </p>

        <div
          ref={trackRef}
          className="mt-8 flex w-full gap-4 overflow-x-auto scroll-smooth pb-3 touch-pan-x no-scrollbar"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {loopingItems.map((item, index) => (
            <article
              key={`${item.label}-${index}`}
              className="relative min-w-[60vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[24vw] flex-shrink-0 rounded-2xl border border-white/20 bg-black/30 shadow-lg transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
            >
              <div className="relative h-52 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 70vw, (max-width: 1280px) 30vw, 23vw"
                  loading="lazy"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <p className="text-lg font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-sm text-gray-300">
                  Authentique, riche en histoire, cette collection célèbre la diversité mondiale.
                </p>
              </div>
            </article>
          ))}
        </div>

        {reduceMotion && (
          <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3 text-sm text-gray-200">
            Mode réduction des animations activé : le carousel est accessible via défilement manuel.
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .no-scrollbar {
            scroll-behavior: auto;
          }
          .no-scrollbar article {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
