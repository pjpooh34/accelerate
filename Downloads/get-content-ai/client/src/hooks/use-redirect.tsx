import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useRedirectAfterLogin() {
  const [location] = useLocation();

  useEffect(() => {
    // Store current location when user navigates to login/signup
    if (location === '/login' || location === '/signup') {
      const referrer = document.referrer;
      const currentHost = window.location.origin;
      
      // If they came from our site, store that path
      if (referrer && referrer.startsWith(currentHost)) {
        const fromPath = referrer.replace(currentHost, '');
        if (fromPath && fromPath !== '/login' && fromPath !== '/signup') {
          localStorage.setItem('redirectAfterLogin', fromPath);
        }
      }
    }
  }, [location]);
}

export function setRedirectPath(path: string) {
  localStorage.setItem('redirectAfterLogin', path);
}