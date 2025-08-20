import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Monitor, Moon, Sun, Languages, RefreshCw, LogOut, Users, Settings, Building2, Stethoscope, Home } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showRefresh = false, 
  onRefresh,
  isRefreshing = false,
  showBack = false
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentUser = user?.username || 'ผู้ใช้';

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
                  ยินดีต้อนรับ {currentUser}
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

            {location.pathname !== '/users' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/users')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                จัดการผู้ใช้
              </Button>
            )}

            {location.pathname !== '/rooms' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/rooms')}
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                จัดการห้องตรวจ
              </Button>
            )}

            {location.pathname !== '/doctors' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/doctors')}
                className="gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                จัดการแพทย์
              </Button>
            )}

            {location.pathname !== '/' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                หน้าแรก
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};