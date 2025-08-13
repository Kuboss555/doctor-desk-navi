import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Monitor, Moon, Sun, Languages, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showRefresh = false, 
  onRefresh,
  isRefreshing = false 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">
                  {t('lastUpdated')}: {new Date().toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('refresh')}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              className="gap-2"
            >
              <Languages className="w-4 h-4" />
              {language.toUpperCase()}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};