import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import reviewsData from '../../data/google-reviews.json';

// Keep only reviews that have text (comments) and rating 5/4 stars
const reviews = reviewsData.filter(r => r.text && r.text.length > 5 && r.rating >= 4);

interface GoogleReviewsSliderProps {
  reviewsUrl: string;
}

export default function GoogleReviewsSlider({ reviewsUrl }: GoogleReviewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Update cards per page based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(reviews.length / cardsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="w-full py-6 select-none relative z-10">
      
      {/* ==================== ANTET (HEADER) CENTRAT CONFORM MACHEТЕI ==================== */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        {/* eyebrow */}
        <span className="text-xs font-bold text-[#cc0000] uppercase tracking-[0.25em] block mb-3">
          — Recenzii —
        </span>
        
        {/* title */}
        <h2 className="text-4xl md:text-5xl font-black text-[#0a0a0b] tracking-tight leading-none mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Ce spun <span className="text-[#cc0000]">cursanții</span> noștri
        </h2>
        
        {/* subtitle */}
        <p className="text-slate-500 font-light text-base md:text-lg mb-6 leading-relaxed">
          Descoperă experiențele cursanților care au ales <span className="text-[#cc0000] font-semibold">Start Drive BVL</span> și au obținut permisul alături de instructorii noștri.
        </p>

        {/* Big centered gold stars */}
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* subtext rating info */}
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
          5.0 din 5 din peste <span className="text-[#cc0000]">140+</span> recenzii
        </span>
      </div>

      {/* ==================== SLIDER CAROUSEL ==================== */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-12 group/slider">
        {/* Săgeată stânga */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000] active:scale-90 transition-all duration-300 shadow-md z-30 cursor-pointer"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Săgeată dreapta */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000] active:scale-90 transition-all duration-300 shadow-md z-30 cursor-pointer"
          aria-label="Următorul"
        >
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Fereastra de vizualizare (Viewport) */}
        <div className="w-full overflow-hidden py-6">
          <motion.div 
            className="flex gap-6 w-full"
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {reviews.map((review, idx) => {
              // Determină dacă acest card este cel din mijlocul paginii active
              const isMiddle = cardsPerPage === 3 
                ? idx === (currentIndex * cardsPerPage + 1)
                : cardsPerPage === 2
                ? idx === (currentIndex * cardsPerPage)
                : idx === currentIndex;

              return (
                <div 
                  key={idx} 
                  className="shrink-0 py-2 relative"
                  style={{ width: `calc((100% - ${(cardsPerPage - 1) * 24}px) / ${cardsPerPage})` }}
                >
                  <div 
                    className={`bg-white border rounded-[32px] p-8 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.04)] transition-all duration-500 h-full flex flex-col justify-between relative overflow-hidden ${
                      isMiddle 
                        ? 'border-red-500/15 shadow-[0_20px_50px_-8px_rgba(204,0,0,0.06)] md:scale-[1.03] z-20' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`} 
                    style={{ minHeight: '300px' }}
                  >
                    {/* Citat transparent pe fundal (watermark dreapta-jos) */}
                    <span className="absolute bottom-4 right-6 text-red-500/[0.04] text-[160px] font-serif select-none pointer-events-none leading-none z-0">
                      ”
                    </span>



                    <div className="relative z-10">
                      {/* Textul recenziei */}
                      <p className="text-xs text-slate-600 font-light leading-relaxed text-left line-clamp-5 mb-6 pt-4">
                        {review.text}
                      </p>
                    </div>

                    <div className="relative z-10">
                      {/* Stelele din interiorul cardului */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: review.rating }).map((_, starIdx) => (
                          <svg key={starIdx} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Profil utilizator */}
                      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100/70">
                        <img 
                          src={review.avatar} 
                          alt={review.name}
                          className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-50 border border-slate-100"
                        />
                        
                        <div className="flex flex-col text-left justify-center">
                          <span 
                            className="text-sm font-extrabold text-slate-800 capitalize leading-none tracking-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {review.name}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ==================== PUNCTE PAGINARE ==================== */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <button
              key={pageIdx}
              onClick={() => setCurrentIndex(pageIdx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === pageIdx 
                  ? 'bg-[#cc0000] w-6' 
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Mergi la pagina ${pageIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Buton „Scrie o Recenzie” - mutat finuț în subsolul secțiunii */}
      <div className="text-center mt-12">
        <a 
          href={reviewsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-slate-900 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span>Scrie o Recenzie pe Google</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
