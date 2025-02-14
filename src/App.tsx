import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Star, Heart } from 'lucide-react';
import queen from './assets/queen.jpeg'
import queen2 from './assets/queen2.jpeg'
import rose1 from './assets/rose2.jpg'
import rose from './assets/rose.jpg'
import MESSAGES from './messages'

// Configuration for the name
const NAME = "ESTHER"; // Using the name from your previous setup

const INTRO_IMAGES = [
  "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&auto=format&fit=crop",
  queen,
  rose1,
  queen2,
];

function App() {
  const [stars, setStars] = useState<{ x: number; y: number; delay: number; opacity: number }[]>([]);
  const [backgroundStars, setBackgroundStars] = useState<{ x: number; y: number; size: number }[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'images' | 'rose' | 'roseMessage' | 'stars'>('images');
  const [currentImage, setCurrentImage] = useState(0);
  const [showRose, setShowRose] = useState(false);
  const [roseCollected, setRoseCollected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

    // Auto advance images
    if (currentStep === 'images') {
      const timer = setInterval(() => {
        if (currentImage < INTRO_IMAGES.length - 1) {
          setCurrentImage(prev => prev + 1);
        } else {
          setCurrentStep('rose');
          setShowRose(true);
        }
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [currentStep, currentImage]);

  useEffect(() => {
    if (currentStep === 'stars') {
      // Create background stars
      const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1
      }));
      setBackgroundStars(stars);
      initializeStars();
    }
  }, [currentStep]);

  const initializeStars = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Adjust spacing for mobile
    const isMobile = width < 768;
    const letterSpacing = isMobile ? 
      Math.min(width / (NAME.length * 2), 40) : 
      Math.min(width / (NAME.length * 1.5), 80);
    const letterHeight = isMobile ? 
      Math.min(letterSpacing * 1.2, 60) : 
      Math.min(letterSpacing * 1.5, 120);
    
    const nameStars = [];
    const startX = centerX - ((NAME.length - 1) * letterSpacing) / 2;

    for (let i = 0; i < NAME.length; i++) {
      const char = NAME[i];
      const baseX = startX + (i * letterSpacing);
      const letterStars = getLetterStars(char, baseX, centerY, letterHeight);
      nameStars.push(...letterStars);
    }

    setStars(nameStars.map((star, i) => ({
      ...star,
      delay: i * 0.2,
      opacity: 0
    })));

    nameStars.forEach((_, i) => {
      setTimeout(() => {
        setStars(prev => prev.map((star, j) => 
          j === i ? { ...star, opacity: 1 } : star
        ));
      }, i * 200);
    });
  };

  const getLetterStars = (char: string, baseX: number, baseY: number, size: number) => {
    const points: { x: number; y: number }[] = [];
    const letterMap: Record<string, number[][]> = {
      A: [[0,2], [0.5,0], [1,2], [0.5,1]],
      B: [[0,0], [0,1], [0,2], [0.5,0], [0.5,1], [0.5,2], [1,0.25], [1,1.75]],
      C: [[1,0], [0.5,0], [0,0.5], [0,1.5], [0.5,2], [1,2]],
      D: [[0,0], [0,1], [0,2], [0.5,0], [1,0.5], [1,1.5], [0.5,2]],
      E: [[1,0], [0,0], [0,1], [0,2], [1,2], [0.5,1]],
      F: [[1,0], [0,0], [0,1], [0,2], [0.5,1]],
      G: [[1,1], [1,2], [0.5,2], [0,1.5], [0,0.5], [0.5,0], [1,0]],
      H: [[0,0], [0,1], [0,2], [0.5,1], [1,0], [1,1], [1,2]],
      I: [[0,0], [0.5,0], [1,0], [0.5,1], [0.5,2], [0,2], [1,2]],
      J: [[0,0], [0.5,0], [1,0], [1,1], [1,2], [0.5,2], [0,1.5]],
      K: [[0,0], [0,1], [0,2], [0.5,1], [1,0], [1,2]],
      L: [[0,0], [0,1], [0,2], [0.5,2], [1,2]],
      M: [[0,2], [0,1], [0,0], [0.5,1], [1,0], [1,1], [1,2]],
      N: [[0,2], [0,1], [0,0], [0.5,1], [1,0], [1,1], [1,2]],
      O: [[0.5,0], [0,0.5], [0,1.5], [0.5,2], [1,1.5], [1,0.5]],
      P: [[0,2], [0,1], [0,0], [0.5,0], [1,0.25], [0.5,1]],
      Q: [[0.5,0], [0,0.5], [0,1.5], [0.5,2], [1,1.5], [1,0.5], [1,2]],
      R: [[0,2], [0,1], [0,0], [0.5,0], [1,0.25], [0.5,1], [1,2]],
      S: [[1,0], [0.5,0], [0,0.5], [0.5,1], [1,1.5], [0.5,2], [0,2]],
      T: [[0,0], [0.5,0], [1,0], [0.5,1], [0.5,2]],
      U: [[0,0], [0,1.5], [0.5,2], [1,1.5], [1,0]],
      V: [[0,0], [0.5,2], [1,0]],
      W: [[0,0], [0.25,2], [0.5,1], [0.75,2], [1,0]],
      X: [[0,0], [0.5,1], [0,2], [1,0], [1,2]],
      Y: [[0,0], [0.5,1], [1,0], [0.5,2]],
      Z: [[0,0], [1,0], [0,2], [1,2], [0.5,1]]
    };

    const pattern = letterMap[char.toUpperCase()] || [];
    const scale = size / 2;
    
    pattern.forEach(([x, y]) => {
      points.push({
        x: baseX + (x * scale),
        y: baseY + (y * scale) - scale
      });
    });

    return points;
  };

  const toggleMute = () => {
    console.log("Audio Ref:", audioRef.current);
    if (audioRef.current) {
      

      if (audioRef.current.paused) {
        audioRef.current.play().catch((err) => console.log("Playback error:", err));
      }
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };
  
  

  const handleStarInteraction = () => {
    setShowMessage(true);
    setCurrentMessage(Math.floor(Math.random() * MESSAGES.length));
  };

  const handleRoseClick = () => {
    setRoseCollected(true);
    setCurrentStep('roseMessage');
    
    // Transition to stars after showing the message
    setTimeout(() => {
      setCurrentStep('stars');
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0a0a2a] relative overflow-hidden cursor-pointer"
      onClick={currentStep === 'stars' ? handleStarInteraction : undefined}
    >
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        autoPlay
src="/memories.mp3"   
/>
      
      {/* Sound Control */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 active:bg-white/20 transition-all z-50"
      >
        {isMuted ? 
          <VolumeX size={24} className="text-white/80" /> : 
          <Volume2 size={24} className="text-white/80" />
        }
      </button>

      {/* Intro Images */}
      {currentStep === 'images' && (
        <div className="absolute inset-0 bg-black">
          {INTRO_IMAGES.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={src}
                alt={`Intro ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>
      )}

      {/* Rose Section */}
      {currentStep === 'rose' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-pink-50 to-pink-200">
          <div 
            className={`transform transition-all duration-1000 ${
              showRose ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            } ${roseCollected ? 'translate-y-[-100vh]' : ''}`}
            onClick={handleRoseClick}
          >
            <div className="relative cursor-pointer group">
              <img
src={rose}                alt="Rose"
                className="w-48 h-48 object-cover rounded-full shadow-lg transform group-hover:scale-105 transition-transform"
              />
              <Heart
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                size={32}
                fill="#ec4899"
              />
            </div>
            <p className="text-center mt-4 text-pink-700 font-serif italic">
              Touch the rose to continue...
            </p>
          </div>
        </div>
      )}

      {/* Rose Message */}
      {currentStep === 'roseMessage' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-pink-50 to-pink-200">
          <div className="text-center animate-fade-in">
            <p className="text-3xl text-pink-700 font-serif italic mb-2">
              I'm glad you picked it
            </p>
            <Heart className="text-pink-500 mx-auto animate-pulse" size={48} fill="#ec4899" />
          </div>
        </div>
      )}

      {/* Stars Section */}
      {currentStep === 'stars' && (
        <>
          {/* Background Stars */}
          {backgroundStars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}

          {/* Constellation Stars */}
          {stars.map((star, i) => (
            <div 
              key={i} 
              className="absolute"
              style={{
                left: `${star.x}px`,
                top: `${star.y}px`,
              }}
            >
              <Star
                size={16}
                className="text-yellow-200 animate-pulse"
                style={{
                  opacity: star.opacity,
                  transition: 'opacity 0.5s ease-in-out',
                  animationDelay: `${star.delay}s`,
                  transform: 'translate(-50%, -50%)'
                }}
                fill="rgba(254, 240, 138, 0.5)"
              />
            </div>
          ))}

          {/* Message */}
          <div 
            className={`absolute bottom-12 left-0 right-0 text-center transition-opacity duration-1000 ${
              showMessage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-white/90 font-serif text-xl md:text-2xl italic px-4">
              {MESSAGES[currentMessage]}
            </p>
            <p className="text-white/50 text-sm mt-4">
              Tap anywhere to see another message
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;