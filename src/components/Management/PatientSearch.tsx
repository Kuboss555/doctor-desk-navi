import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, ScanLine } from 'lucide-react';
import { apiService, Patient } from '@/services/apiService';

interface PatientSearchProps {
  onPatientFound: (patient: Patient) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ onPatientFound }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Patient | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const patient = await apiService.searchPatient(searchTerm);
      setSearchResult(patient);
      if (patient) {
        onPatientFound(patient);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBarcodeScan = () => {
    // Mock barcode scan - in real implementation, this would open camera
    console.log('Opening barcode scanner...');
    // For demo, simulate a scanned HN
    setSearchTerm('HN001234');
    handleSearch();
  };

  return (
    <Card className="queue-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>{t('patientManagement')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder={t('searchPatient')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleBarcodeScan}>
            <ScanLine className="w-4 h-4" />
          </Button>
        </div>

        {searchResult && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-foreground">{searchResult.name}</h4>
            <p className="text-sm text-muted-foreground">{searchResult.hn}</p>
            <p className="text-sm text-muted-foreground">
              {t('room')}: {searchResult.roomId || 'ไม่ได้จัดห้อง'}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('queue')}: {searchResult.queueNumber || 'ไม่มีคิว'}
            </p>
          </div>
        )}

        {searchTerm && !searchResult && !isSearching && (
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">ไม่พบข้อมูลผู้ป่วย</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};