'use client'

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';


interface IModeToggle {
  isExpanded: boolean;
};


export const ModeToggle: React.FC<IModeToggle> = ({ isExpanded }) => {
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
    <>
      {isExpanded ? (
        <Switch 
          checked={isLightModeActive} 
          onCheckedChange={handleSwitchMode} 
        />
      ) : (
        <Button 
          type='button' 
          onClick={handleSwitchMode} 
          className='w-10 h-10 m-center bg-primary-7 rounded-full text-white'
        >
          {theme === 'light' ? (
            <Sun />
          ) : (
            <Moon />
          )}
        </Button>
      )}
    </>
  );
};