import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { PatientSearch } from '@/components/Management/PatientSearch';
import { QueueControls } from '@/components/Management/QueueControls';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, QueueData, Patient } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Building2, Stethoscope, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Management = () => {
  const { t } = useLanguage();
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getDashboardData();
      setQueueData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePatientFound = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleUpdate = () => {
    fetchData();
    setSelectedPatient(undefined);
  };

  if (!queueData) {
    return (
      <div className="min-h-screen bg-background">
        <Header title={t('management')} />
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

  return (
    <div className="min-h-screen bg-background">
      <Header title={t('management')} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">จัดการคิวผู้ป่วย</h2>
            <p className="text-muted-foreground">ระบบจัดการคิวสำหรับพยาบาล</p>
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
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                หน้าแรก
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PatientSearch onPatientFound={handlePatientFound} />
          </div>
          <div>
            <QueueControls 
              rooms={queueData.rooms}
              selectedPatient={selectedPatient}
              onUpdate={handleUpdate}
            />
          </div>
        </div>

        {/* Patient List */}
        <Card className="queue-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>รายการผู้ป่วยในแผนก</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {queueData.patients.map((patient) => {
                const room = queueData.rooms.find(r => r.id === patient.roomId);
                const doctor = queueData.doctors.find(d => d.roomId === patient.roomId);
                
                return (
                  <div
                    key={patient.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {patient.queueNumber || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.hn}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {room?.name || 'ไม่ได้จัดห้อง'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doctor?.name || 'ไม่มีแพทย์'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          มาถึง: {patient.arrivalTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Management;