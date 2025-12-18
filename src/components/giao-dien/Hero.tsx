
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner, Language } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface HeroProps {
  onCtaClick: () => void;
  banners: Banner[];
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick, banners, language }) => {
  const activeBanners = banners.filter(b => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const t = TRANSLATIONS[language];

  // Auto-slide effect
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Countdown Logic
  useEffect(() => {
    const currentBanner = activeBanners[currentIndex];
    if (!currentBanner?.endsAt) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(currentBanner.endsAt!).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, activeBanners]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-coffee-900">
      
      {/* Background Image with Transition */}
      {activeBanners.map((b, idx) => (
        <div 
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={b.imageUrl}
            alt={b.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-coffee-900/90"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white mt-16 sm:mt-20 max-w-4xl">
        <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
          {banner.endsAt && timeLeft && (
             <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-red-600/90 text-white px-4 sm:px-6 py-2 rounded-full mb-6 sm:mb-8 backdrop-blur-sm border border-red-500/50 shadow-lg shadow-red-900/50">
                <span className="font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t.hero.ends_in}
                </span>
                <div className="flex gap-1 sm:gap-2 font-mono font-bold text-base sm:text-lg">
                   <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
                   <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
                   <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                   <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
             </div>
          )}

          {!banner.endsAt && (
            <span className="inline-block py-1 px-2 sm:px-3 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wider mb-4 sm:mb-6">
              {t.hero.est}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6 leading-tight drop-shadow-2xl px-2">
            {banner.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-10 mx-auto font-light leading-relaxed max-w-2xl px-2">
            {banner.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
            <button 
              onClick={onCtaClick}
              className="group bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-600/25 flex items-center gap-2 active:scale-95 touch-manipulation w-full sm:w-auto justify-center"
            >
              {banner.ctaText || t.hero.cta}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {activeBanners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all backdrop-blur-sm z-20 active:scale-95 touch-manipulation"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all backdrop-blur-sm z-20 active:scale-95 touch-manipulation"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                  idx === currentIndex ? 'bg-amber-500 w-6 sm:w-8' : 'bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

