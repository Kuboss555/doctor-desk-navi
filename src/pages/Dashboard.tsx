import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { QueueCard } from '@/components/Dashboard/QueueCard';
import { StatsOverview } from '@/components/Dashboard/StatsOverview';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, QueueData } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { Settings, Users, Building2, Stethoscope, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { t } = useLanguage();
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getDashboardData();
      setQueueData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (!queueData) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="NR Dashboard" showRefresh onRefresh={fetchDashboardData} isRefreshing={isLoading} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeDoctors = queueData.doctors.filter(d => d.isActive).length;
  const currentQueues = queueData.rooms.reduce((sum, room) => sum + (room.currentQueue || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="NR Dashboard Queue System" 
        showRefresh 
        onRefresh={fetchDashboardData} 
        isRefreshing={isLoading}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('departmentOverview')}</h2>
            <p className="text-muted-foreground">ระบบแสดงผลคิวห้องตรวจแพทย์แบบเรียลไทม์</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/users">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                จัดการผู้ใช้
              </Button>
            </Link>
            <Link to="/rooms">
              <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" />
                จัดการห้องตรวจ
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" className="gap-2">
                <Stethoscope className="w-4 h-4" />
                จัดการแพทย์
              </Button>
            </Link>
            <Link to="/management">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                {t('management')}
              </Button>
            </Link>
          </div>
        </div>

        <StatsOverview 
          totalRooms={queueData.rooms.length}
          activeDoctors={activeDoctors}
          currentQueues={currentQueues}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {queueData.rooms.map((room) => {
            const doctor = queueData.doctors.find(d => d.roomId === room.id);
            const currentPatient = queueData.patients.find(
              p => p.roomId === room.id && p.queueNumber === room.currentQueue
            );
            
            return (
              <QueueCard
                key={room.id}
                room={room}
                doctor={doctor}
                currentPatient={currentPatient}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;