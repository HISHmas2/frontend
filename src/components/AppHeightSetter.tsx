'use client';

import { useEffect } from 'react';

export default function AppHeightSetter() {
  useEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${h}px`);
    };

    set();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', set);
    vv?.addEventListener('scroll', set);

    window.addEventListener('resize', set);
    window.addEventListener('orientationchange', set);

    return () => {
      vv?.removeEventListener('resize', set);
      vv?.removeEventListener('scroll', set);
      window.removeEventListener('resize', set);
      window.removeEventListener('orientationchange', set);
    };
  }, []);

  return null;
}
