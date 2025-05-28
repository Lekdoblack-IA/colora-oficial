
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeftProps {
  expiresAt: Date;
}

export const TimeLeft = ({ expiresAt }: TimeLeftProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const difference = expiry - now;
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
        const seconds = Math.floor(difference % (1000 * 60) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expirada');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex items-center space-x-1 text-xs text-red-600">
      <Clock className="w-3 h-3" />
      <span>Expira em {timeLeft}</span>
    </div>
  );
};
