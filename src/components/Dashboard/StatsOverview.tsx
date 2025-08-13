import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, UserCheck, Activity } from 'lucide-react';

interface StatsOverviewProps {
  totalRooms: number;
  activeDoctors: number;
  currentQueues: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalRooms,
  activeDoctors,
  currentQueues
}) => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('totalRooms'),
      value: totalRooms,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('activeDoctors'),
      value: activeDoctors,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: t('currentQueues'),
      value: currentQueues,
      icon: Activity,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="queue-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};