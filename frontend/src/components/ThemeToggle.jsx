import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On component mount, check if user has a theme preference saved
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }, []);

  const applyTheme = theme => {
    // Remove existing theme stylesheets
    const existingThemeLink = document.getElementById('theme-css');
    if (existingThemeLink) {
      existingThemeLink.remove();
    }

    // Create and add new theme stylesheet
    const link = document.createElement('link');
    link.id = 'theme-css';
    link.rel = 'stylesheet';
    link.href = `/styles/${theme}-theme.css`;
    document.head.appendChild(link);

    // Toggle body class for any additional styling
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Save preference
    localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    applyTheme(newMode ? 'dark' : 'light');
  };

  return (
    <div>
      <Button
        icon={isDarkMode ? 'pi pi-sun' : 'pi pi-moon'}
        onClick={toggleTheme}
        className="p-button-rounded p-button-text"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 999,
        }}
        tooltip={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        tooltipOptions={{ position: 'left' }}
      />
    </div>
  );
};

export default ThemeToggle;
