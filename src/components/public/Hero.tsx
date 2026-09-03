import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, 
  Award, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Radio, 
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Target,
  Medal,
  QrCode,
  Lock,
  Activity,
  Check,
  Pause,
  Play
} from 'lucide-react';
import { CURRENT_SEASON } from '../../config/season';
import { HeroSlide } from '../../types';
import { api } from '../../services/api';

interface HeroProps {
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenLiveScore?: () => void;
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-01',
    badge: 'WELCOME TO UPRSA',
    title: 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION',
    subtitle: 'Promoting Roller Sports Across Uttar Pradesh • Building Champions, Building Nation. State Governing Body Affiliated with Roller Skating Federation of India (RSFI).',
    imageUrl: '/images/hero-speed-skating-1.jpg',
    actionText: 'EXPLORE MORE',
    actionLink: 'about',
    order: 1,
    isActive: true
  },
  {
    id: 'slide-02',
    badge: 'OFFICIAL SKATER REGISTRATION 2026–27',
    title: 'OFFICIAL SKATER REGISTRATION & DIGITAL ID',
    subtitle: 'Register with Uttar Pradesh Roller Sports Association (UPRSA) and receive your official digital Skater ID card with verified QR authentication.',
    imageUrl: '/images/hero-speed-skating-2.jpg',
    actionText: 'REGISTER AS SKATER',
    actionLink: 'register',
    order: 2,
    isActive: true
  },
  {
    id: 'slide-03',
    badge: 'STATE CHAMPIONSHIPS & NATIONAL TRIALS',
    title: '36th UP STATE ROLLER SKATING CHAMPIONSHIP 2026',
    subtitle: 'Official Selection Trials for the 63rd RSFI Nationals. Speed banked track heats, inline freestyle slalom & roller hockey competitions in Lucknow.',
    imageUrl: '/images/hero-speed-skating-3.jpg',
    actionText: 'EXPLORE CHAMPIONSHIPS',
    actionLink: 'tournaments',
    order: 3,
    isActive: true
  },
  {
    id: 'slide-04',
    badge: 'LIVE RACE SCORING & STATE RANKINGS',
    title: 'OFFICIAL ELECTRONIC PHOTO-FINISH RESULTS',
    subtitle: 'Track official electronic photo-finish lap timings, heat progressions, medal tallies, and district leaderboards in real-time.',
    imageUrl: '/images/hero-speed-skating-4.jpg',
    actionText: 'VIEW LIVE RESULTS',
    actionLink: 'results',
    order: 4,
    isActive: true
  }
];

export const Hero: React.FC<HeroProps> = ({ 
  setCurrentView, 
  onNavigate, 
  onOpenLiveScore,
  slides: initialSlides
}) => {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const navigate = (view: string) => {
    // Strip leading hash if actionLink format is '#register'
    const cleanView = view.replace(/^#/, '');
    if (cleanView === 'live_score' && onOpenLiveScore) {
      onOpenLiveScore();
      return;
    }
    if (onNavigate) onNavigate(cleanView);
    if (setCurrentView) setCurrentView(cleanView);
  };

  // Fetch hero slides from API if not supplied via props
  useEffect(() => {
    if (!initialSlides || initialSlides.length === 0) {
      api.getHeroSlides()
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const activeOnly = res.data.filter(s => s.isActive !== false);
            if (activeOnly.length > 0) {
              setSlides(activeOnly);
            }
          }
        })
        .catch((err) => {
          console.warn('Using default hero slides:', err);
        });
    } else {
      const activeOnly = initialSlides.filter(s => s.isActive !== false);
      if (activeOnly.length > 0) {
        setSlides(activeOnly);
      }
    }
  }, [initialSlides]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay Effect (5.5 seconds per slide)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide, currentIndex]);

  // Touch Swipe Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      const threshold = 40; // minimum 40px swipe distance
      if (diffX > threshold) {
        // Swiped Left -> Next Slide
        nextSlide();
      } else if (diffX < -threshold) {
        // Swiped Right -> Prev Slide
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsPaused(false);
  };

  const activeSlide = slides[currentIndex] || DEFAULT_SLIDES[0];

  return (
    <div 
      className="relative w-full bg-[#070d18] overflow-hidden text-white border-b border-amber-500/20 select-none group"
      role="region"
      aria-label="UPRSA Official Portal Hero Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides with High Clarity & Cinematic Vivid Sports Imagery */}
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full pointer-events-none">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || `bg-${idx}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.imageUrl || DEFAULT_SLIDES[0].imageUrl}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center brightness-[0.92] contrast-[1.06] saturate-[1.12] transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Directional Overlay: Dark navy on the left behind text, transparent on middle & right so skaters are 100% visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/95 via-[#050914]/75 via-35% md:via-[#050914]/30 md:via-55% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent via-15% to-[#070d18]/40" />
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (7 cols): Main Title, Subtitle, Dynamic CTAs & Trust Strip */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all">
              <Shield className="w-4 h-4 shrink-0 fill-current" />
              <span>{activeSlide.badge || 'WELCOME TO UPRSA'}</span>
            </div>

            {/* Main Heading with Key Transition Effect */}
            <div key={`title-${currentIndex}`} className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                {activeSlide.title.includes('ROLLER SPORTS') ? (
                  <>
                    UTTAR PRADESH <br />
                    ROLLER SPORTS <br />
                    <span className="text-amber-400">ASSOCIATION</span>
                  </>
                ) : activeSlide.title.includes('REGISTRATION') ? (
                  <>
                    OFFICIAL SKATER <br />
                    <span className="text-amber-400">REGISTRATION 2026–27</span>
                  </>
                ) : activeSlide.title.includes('36th') ? (
                  <>
                    36th UP STATE <br />
                    <span className="text-amber-400">CHAMPIONSHIP 2026</span>
                  </>
                ) : activeSlide.title.includes('RESULTS') ? (
                  <>
                    ELECTRONIC PHOTO-FINISH <br />
                    <span className="text-amber-400">LIVE RACE SCORING</span>
                  </>
                ) : (
                  <span className="text-amber-400">{activeSlide.title}</span>
                )}
              </h1>
            </div>

            {/* Supporting Text */}
            <p 
              key={`sub-${currentIndex}`} 
              className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              {activeSlide.subtitle}
            </p>

            {/* Action Buttons Row: Primary Golden CTA, Skater Registration, Verification */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Primary CTA (Driven by Active Slide) */}
              <button
                id="hero-register-btn"
                onClick={() => navigate(activeSlide.actionLink || 'about')}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{activeSlide.actionText || 'EXPLORE MORE'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
              </button>

              {/* Secondary CTA: SKATER REGISTRATION */}
              <button
                id="hero-skater-reg-btn"
                onClick={() => navigate('register')}
                className="bg-[#0b1329]/90 hover:bg-[#0f1b3b] text-white font-bold px-6 py-4 rounded-xl text-sm border border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-2 backdrop-blur-md shadow-lg shadow-black/50 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>SKATER REGISTRATION</span>
              </button>

              {/* Third CTA: VERIFY ATHLETE ID */}
              <button
                id="hero-verify-athlete-btn"
                onClick={() => navigate('verify_athlete')}
                className="bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white font-bold px-5 py-4 rounded-xl text-sm border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-md"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>VERIFY ID</span>
              </button>

            </div>

            {/* Official Trust Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official UPRSA Portal</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital Athlete ID</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>QR Verification</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>75 Affiliated Districts</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Completely unobstructed view of skaters and background */}
          <div className="hidden lg:block lg:col-span-5 min-h-[300px] pointer-events-none" />

        </div>

        {/* ========================================================================= */}
        {/* SLIDER NAVIGATION & INTERACTIVE CONTROLS DOCK */}
        {/* ========================================================================= */}
        {totalSlides > 1 && (
          <div className="mt-8 pt-6 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left: Pagination Dots and Counter */}
            <div className="flex items-center gap-4">
              
              {/* Interactive Dots / Pills */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero Slides">
                {slides.map((_, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={`dot-${idx}`}
                      onClick={() => goToSlide(idx)}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to slide ${idx + 1} of ${totalSlides}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        isActive
                          ? 'w-8 h-2.5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/50'
                          : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Slide Counter */}
              <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                <span className="text-amber-400">0{currentIndex + 1}</span>
                <span className="text-slate-600">/</span>
                <span>0{totalSlides}</span>
              </div>

              {/* Autoplay Pause/Play Indicator */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
                aria-label={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
                className="text-slate-500 hover:text-amber-400 transition-colors p-1 rounded-lg hover:bg-slate-800/80 cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Right: Previous and Next Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                id="hero-prev-btn"
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={nextSlide}
                id="hero-next-btn"
                aria-label="Next Slide"
                className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Floating Side Arrows on Desktop for Quick Lateral Navigation */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#070d18]/80 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-amber-400 items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden md:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#070d18]/80 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-amber-400 items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </>
      )}

    </div>
  );
};

