import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

export const PageTransition = ({
  children,
  delay = 200,
}: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timerReset = setTimeout(() => setIsVisible(false), 0);
    const timerShow = setTimeout(() => setIsVisible(true), delay);
    return () => {
      clearTimeout(timerReset);
      clearTimeout(timerShow);
    };
  }, [location.pathname, delay]);

  return (
    <div
      key={location.pathname}
      className={
        isVisible
          ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
          : "opacity-0"
      }
    >
      {children}
    </div>
  );
};
