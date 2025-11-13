import { useEffect } from 'react';
import pageMarkup from './pageMarkup.html?raw';

const App = () => {
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));

    const handleAnchorClick = (event) => {
      const href = event.currentTarget.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    anchors.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, observerOptions)
        : null;

    const fadeElements = observer ? Array.from(document.querySelectorAll('.fade-in')) : [];
    fadeElements.forEach((element) => observer?.observe(element));

    const handleScroll = () => {
      let current = '';
      const sections = document.querySelectorAll('section[id]');

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') ?? '';
        }
      });

      document.querySelectorAll('.nav-links a').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) {
          return;
        }

        link.classList.toggle('active', href === `#${current}` && current.length > 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener('click', handleAnchorClick));
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className="site-wrapper"
      // Keeps the original static markup intact while React handles hydration-like behavior.
      dangerouslySetInnerHTML={{ __html: pageMarkup }}
    />
  );
};

export default App;

