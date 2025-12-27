import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

export const PageTransition = ({ children, delay = 200 }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsVisible(false);
    setKey((prev) => prev + 1);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  if (!isVisible) {
    return (
      <div key={key} className="opacity-0">
        {children}
      </div>
    );
  }

  return (
    <div
      key={key}
      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
    >
      {children}
    </div>
  );
};
