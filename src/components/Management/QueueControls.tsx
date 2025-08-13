import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, ArrowRight, Trash2, Volume2 } from 'lucide-react';
import { apiService, Room, Patient } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface QueueControlsProps {
  rooms: Room[];
  selectedPatient?: Patient;
  onUpdate: () => void;
}

export const QueueControls: React.FC<QueueControlsProps> = ({ 
  rooms, 
  selectedPatient, 
  onUpdate 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQueue = async () => {
    if (!selectedPatient || !selectedRoomId) {
      toast({
        title: 'กรุณาเลือกผู้ป่วยและห้อง',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.addQueue(selectedPatient.hn, selectedRoomId);
      toast({
        title: 'เพิ่มคิวสำเร็จ',
        description: `เพิ่มคิวสำหรับ ${selectedPatient.name} ในห้อง ${selectedRoomId}`
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveQueue = async () => {
    if (!selectedPatient || !selectedRoomId) {
      toast({
        title: 'กรุณาเลือกผู้ป่วยและห้องปลายทาง',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.moveQueue(selectedPatient.id, selectedRoomId);
      toast({
        title: 'ย้ายคิวสำเร็จ',
        description: `ย้าย ${selectedPatient.name} ไปห้อง ${selectedRoomId}`
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQueue = async () => {
    if (!selectedPatient) {
      toast({
        title: 'กรุณาเลือกผู้ป่วย',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.deleteQueue(selectedPatient.id);
      toast({
        title: 'ลบคิวสำเร็จ',
        description: `ลบคิวของ ${selectedPatient.name}`
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallQueue = async () => {
    if (!selectedPatient || !selectedPatient.roomId) {
      toast({
        title: 'กรุณาเลือกผู้ป่วยที่มีห้อง',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiService.callQueue(selectedPatient.roomId, selectedPatient.queueNumber || 0);
      toast({
        title: 'เรียกคิวสำเร็จ',
        description: `เรียกคิว ${selectedPatient.queueNumber} ห้อง ${selectedPatient.roomId}`
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="queue-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRight className="w-5 h-5" />
          <span>จัดการคิว</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPatient && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="font-medium text-primary">{selectedPatient.name}</p>
            <p className="text-sm text-muted-foreground">{selectedPatient.hn}</p>
          </div>
        )}

        <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกห้องตรวจ" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleAddQueue} 
            disabled={isLoading || !selectedPatient}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('addQueue')}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleMoveQueue}
            disabled={isLoading || !selectedPatient}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            {t('moveQueue')}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDeleteQueue}
            disabled={isLoading || !selectedPatient}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t('deleteQueue')}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleCallQueue}
            disabled={isLoading || !selectedPatient}
            className="gap-2"
          >
            <Volume2 className="w-4 h-4" />
            {t('callQueue')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};