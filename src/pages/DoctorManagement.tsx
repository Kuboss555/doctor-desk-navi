import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Edit, Trash2, Search, User, Stethoscope, Building2, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  roomId?: string;
  roomNumber?: string;
  isActive: boolean;
  createdAt: string;
}

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  department: string;
  isActive: boolean;
}

export const DoctorManagement = () => {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignRoomDialogOpen, setIsAssignRoomDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    licenseNumber: '',
    roomId: ''
  });

  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms: Room[] = [
      { id: '1', roomNumber: '101', floor: '1', department: 'อายุรกรรม', isActive: true },
      { id: '2', roomNumber: '102', floor: '1', department: 'อายุรกรรม', isActive: true },
      { id: '3', roomNumber: '201', floor: '2', department: 'ศัลยกรรม', isActive: true },
      { id: '4', roomNumber: '202', floor: '2', department: 'ศัลยกรรม', isActive: false }
    ];
    setRooms(mockRooms);

    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'ดร. จอห์น สมิธ',
        specialization: 'อายุรกรรม',
        licenseNumber: 'MD001',
        roomId: '1',
        roomNumber: '101',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'ดร. แมรี่ จอห์นสัน',
        specialization: 'อายุรกรรม',
        licenseNumber: 'MD002',
        roomId: '2',
        roomNumber: '102',
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        name: 'ดร. ไมเคิล บราวน์',
        specialization: 'ศัลยกรรม',
        licenseNumber: 'MD003',
        isActive: true,
        createdAt: '2024-02-01'
      }
    ];
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      licenseNumber: '',
      roomId: ''
    });
  };

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialization || !formData.licenseNumber) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: formData.name,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      roomId: formData.roomId || undefined,
      roomNumber: formData.roomId ? rooms.find(r => r.id === formData.roomId)?.roomNumber : undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDoctors(prev => [...prev, newDoctor]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "สำเร็จ",
      description: "เพิ่มแพทย์ใหม่เรียบร้อยแล้ว",
    });
  };

  const handleEditDoctor = () => {
    if (!selectedDoctor || !formData.name || !formData.specialization || !formData.licenseNumber) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    setDoctors(prev => prev.map(doctor =>
      doctor.id === selectedDoctor.id
        ? { 
            ...doctor, 
            name: formData.name, 
            specialization: formData.specialization, 
            licenseNumber: formData.licenseNumber 
          }
        : doctor
    ));

    setIsEditDialogOpen(false);
    setSelectedDoctor(null);
    resetForm();
    toast({
      title: "สำเร็จ",
      description: "แก้ไขข้อมูลแพทย์เรียบร้อยแล้ว",
    });
  };

  const handleDeleteDoctor = () => {
    if (!selectedDoctor) return;

    setDoctors(prev => prev.filter(doctor => doctor.id !== selectedDoctor.id));
    setIsDeleteDialogOpen(false);
    setSelectedDoctor(null);
    toast({
      title: "สำเร็จ",
      description: "ลบแพทย์เรียบร้อยแล้ว",
    });
  };

  const handleAssignRoom = () => {
    if (!selectedDoctor || !formData.roomId) return;

    const room = rooms.find(r => r.id === formData.roomId);
    setDoctors(prev => prev.map(doctor =>
      doctor.id === selectedDoctor.id
        ? { ...doctor, roomId: formData.roomId, roomNumber: room?.roomNumber }
        : doctor
    ));

    setIsAssignRoomDialogOpen(false);
    setSelectedDoctor(null);
    resetForm();
    toast({
      title: "สำเร็จ",
      description: "จัดสรรห้องตรวจให้แพทย์เรียบร้อยแล้ว",
    });
  };

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      roomId: doctor.roomId || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const openAssignRoomDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      roomId: doctor.roomId || ''
    });
    setIsAssignRoomDialogOpen(true);
  };

  const toggleDoctorStatus = (doctorId: string) => {
    setDoctors(prev => prev.map(doctor =>
      doctor.id === doctorId
        ? { ...doctor, isActive: !doctor.isActive }
        : doctor
    ));
  };

  const getAvailableRooms = () => {
    const assignedRoomIds = doctors
      .filter(d => d.isActive && d.roomId)
      .map(d => d.roomId);
    
    return rooms.filter(room => 
      room.isActive && !assignedRoomIds.includes(room.id)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="จัดการแพทย์" showBack />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">จัดการแพทย์</h2>
            <p className="text-muted-foreground">เพิ่ม แก้ไข และลบข้อมูลแพทย์ รวมถึงจัดสรรห้องตรวจ</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              หน้าแรก
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มแพทย์ใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>เพิ่มแพทย์ใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลแพทย์ใหม่ในระบบ
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="กรอกชื่อ-นามสกุลแพทย์"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">สาขาเฉพาะทาง</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    placeholder="เช่น อายุรกรรม, ศัลยกรรม"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">เลขที่ใบอนุญาต</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="กรอกเลขที่ใบอนุญาต"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomId">ห้องตรวจ (ไม่บังคับ)</Label>
                  <Select value={formData.roomId} onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกห้องตรวจ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ไม่ระบุห้อง</SelectItem>
                      {getAvailableRooms().map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          ห้อง {room.roomNumber} - ชั้น {room.floor} ({room.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddDoctor}>
                  เพิ่มแพทย์
                </Button>
              </DialogFooter>
            </DialogContent>
                      </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาแพทย์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อแพทย์ทั้งหมด ({filteredDoctors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>แพทย์</TableHead>
                  <TableHead>สาขาเฉพาะทาง</TableHead>
                  <TableHead>เลขที่ใบอนุญาต</TableHead>
                  <TableHead>ห้องตรวจ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">แพทย์</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.licenseNumber}</TableCell>
                    <TableCell>
                      {doctor.roomNumber ? (
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>ห้อง {doctor.roomNumber}</span>
                        </div>
                      ) : (
                        <Badge variant="secondary">ยังไม่ได้จัดสรร</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={doctor.isActive ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleDoctorStatus(doctor.id)}
                      >
                        {doctor.isActive ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>{doctor.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAssignRoomDialog(doctor)}
                        >
                          <Building2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(doctor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(doctor)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Doctor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลแพทย์</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลแพทย์ในระบบ
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">สาขาเฉพาะทาง</Label>
                <Input
                  id="edit-specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-licenseNumber">เลขที่ใบอนุญาต</Label>
                <Input
                  id="edit-licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleEditDoctor}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Room Dialog */}
        <Dialog open={isAssignRoomDialogOpen} onOpenChange={setIsAssignRoomDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>จัดสรรห้องตรวจให้แพทย์</DialogTitle>
              <DialogDescription>
                เลือกห้องตรวจสำหรับแพทย์ {selectedDoctor?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assign-roomId">ห้องตรวจ</Label>
                <Select value={formData.roomId} onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกห้องตรวจ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ไม่ระบุห้อง</SelectItem>
                    {getAvailableRooms().map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        ห้อง {room.roomNumber} - ชั้น {room.floor} ({room.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignRoomDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleAssignRoom}>
                จัดสรรห้อง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Doctor Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันการลบแพทย์</DialogTitle>
              <DialogDescription>
                คุณต้องการลบแพทย์ "{selectedDoctor?.name}" หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button variant="destructive" onClick={handleDeleteDoctor}>
                ลบแพทย์
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DoctorManagement; 