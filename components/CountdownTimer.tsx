import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface CountdownTimerProps {
  compact?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Target Date: January 7th, 2026 at 10:00 AM
      const targetDate = new Date(2026, 0, 7, 10, 0, 0); 
      
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  if (compact) {
    return (
      <div className="flex flex-row-reverse items-center gap-2 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full text-xs font-bold border border-sky-100 shadow-sm mx-2">
         <Clock size={14} className="text-sky-500" />
         <div className="flex gap-1" dir="ltr">
             <span>{timeLeft.days}d</span>
             <span className="opacity-50">:</span>
             <span>{timeLeft.hours}h</span>
             <span className="opacity-50">:</span>
             <span>{timeLeft.minutes}m</span>
         </div>
      </div>
    );
  }

  // Fallback full version (though unused now in main view based on request)
  return (
    <div className="w-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white mb-6 transform transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock size={24} className="text-yellow-300" />
          זמן שנותר למבחן
        </h3>
        <div className="flex items-center gap-1 text-white/80 text-sm font-bold">
            <Calendar size={16} />
            7/1/26 10:00
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
        <TimeUnit value={timeLeft.days} label="ימים" />
        <TimeUnit value={timeLeft.hours} label="שעות" />
        <TimeUnit value={timeLeft.minutes} label="דקות" />
        <TimeUnit value={timeLeft.seconds} label="שניות" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{value: number, label: string}> = ({ value, label }) => (
  <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm flex flex-col items-center justify-center">
    <div className="text-2xl font-bold font-display tabular-nums tracking-wider">{String(value).padStart(2, '0')}</div>
    <div className="text-xs opacity-90 font-medium">{label}</div>
  </div>
);

export default CountdownTimer;