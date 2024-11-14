'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '../ui/switch'

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isLightModeActive, setIsLightModeActive] = useState<boolean>(false);
  
  const handleSwitchMode = () => {
    if(theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
    setIsLightModeActive(!isLightModeActive);
  }

  useEffect(() => {
    if(theme === 'light') {
      setIsLightModeActive(false);
    } else {
      setIsLightModeActive(true);
    }
  }, [theme]);

  return (
    <div className='p-3 bg-background'>
      <Switch checked={isLightModeActive} onCheckedChange={handleSwitchMode} />
    </div>
  );
};