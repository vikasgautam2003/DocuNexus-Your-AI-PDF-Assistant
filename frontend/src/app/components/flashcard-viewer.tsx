"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardViewerProps {
  cards: Flashcard[];
  onClose: () => void;
}

export function FlashcardViewer({ cards, onClose }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl p-6">
        
        {/* Close Button */}
        <Button 
          onClick={onClose}
          variant="ghost" 
          size="icon" 
          className="absolute right-8 top-0 text-white hover:bg-white/20 hover:text-white rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Progress */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white tracking-wider border border-white/10">
            CARD {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* The Card (3D Flip Container) */}
        <div 
          className="group relative h-80 w-full cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
            
            {/* FRONT */}
            <div className="absolute inset-0 h-full w-full backface-hidden rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center p-8 text-center border border-slate-200">
              <div className="mb-4 text-indigo-500 font-bold text-xs uppercase tracking-widest">Question</div>
              <h3 className="text-2xl font-semibold text-slate-800 leading-tight">
                {currentCard.front}
              </h3>
              <div className="absolute bottom-6 text-slate-400 text-xs flex items-center gap-2">
                 <RotateCw className="h-3 w-3" /> Click to flip
              </div>
            </div>

            {/* BACK */}
            <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="mb-4 text-indigo-200 font-bold text-xs uppercase tracking-widest">Answer</div>
              <p className="text-xl font-medium leading-relaxed">
                {currentCard.back}
              </p>
            </div>

          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 px-12">
            <Button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                variant="outline"
                className="rounded-full h-12 w-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/40"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                variant="outline"
                className="rounded-full h-12 w-12 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/40"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>

      </div>

      {/* Tailwind Utility for 3D Transform (Add to your globals.css if needed, or rely on plugin) 
          If you don't have the 3d plugin, standard style prop works below */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}