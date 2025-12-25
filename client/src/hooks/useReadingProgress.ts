import { useEffect, useState } from 'react';

/**
 * Hook to track reading progress based on scroll position
 * Returns a percentage (0-100) indicating how far the user has scrolled
 */
export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get total scrollable height
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate total scrollable distance
      const scrollableHeight = scrollHeight - clientHeight;
      
      // Calculate progress percentage (0-100)
      const progressPercentage = scrollableHeight > 0 
        ? (scrollTop / scrollableHeight) * 100 
        : 0;
      
      // Clamp between 0 and 100
      const clampedProgress = Math.min(100, Math.max(0, progressPercentage));
      
      setProgress(clampedProgress);
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });
    
    // Update on resize (content height might change)
    window.addEventListener('resize', updateProgress, { passive: true });
    
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return progress;
}
