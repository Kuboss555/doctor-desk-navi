import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Doctor, Room, Patient } from '@/services/apiService';
import { User, Stethoscope, Clock } from 'lucide-react';

interface QueueCardProps {
  room: Room;
  doctor?: Doctor;
  currentPatient?: Patient;
}

export const QueueCard: React.FC<QueueCardProps> = ({ room, doctor, currentPatient }) => {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    if (!currentPatient) {
      return (
        <Badge variant="secondary" className="status-completed">
          {t('waiting')}
        </Badge>
      );
    }

    if (currentPatient.status === 'active') {
      return (
        <Badge variant="default" className="status-active pulse-active">
          {t('active')}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="status-waiting">
        {t('waiting')}
      </Badge>
    );
  };

  return (
    <Card className="queue-card hover:scale-105 transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Room Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {room.id}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground">{t('room')}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Doctor Information */}
          {doctor && (
            <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
              <Stethoscope className="w-5 h-5 text-medical-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
          )}

          {/* Current Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('currentQueue')}</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {currentPatient?.arrivalTime || '--:--'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {room.currentQueue || '--'}
                </div>
                <div className="text-sm text-muted-foreground">{t('queue')}</div>
              </div>
            </div>

            {/* Patient Information */}
            {currentPatient && (
              <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <User className="w-5 h-5 text-accent" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{currentPatient.name}</p>
                  <p className="text-sm text-muted-foreground">{currentPatient.hn}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};