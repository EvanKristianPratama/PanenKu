'use client';

import { useState, useEffect } from 'react';

// ============================================
// Types
// ============================================
interface UseNavbarScrollReturn {
  isScrolled: boolean;
  isVisible: boolean;
}

// ============================================
// Hook
// ============================================
/**
 * Hook untuk handle navbar scroll behavior
 * - isScrolled: true jika sudah scroll > 10px
 * - isVisible: false jika scroll down (hide navbar), true jika scroll up
 */
export function useNavbarScroll(): UseNavbarScrollReturn {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down past 80px
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Add background when scrolled past 10px
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return { isScrolled, isVisible };
}
