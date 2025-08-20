import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Edit, Trash2, Search, Building2, MapPin, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export const RoomManagement = () => {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    department: ''
  });

  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: '1',
        roomNumber: '101',
        floor: '1',
        department: 'อายุรกรรม',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        roomNumber: '102',
        floor: '1',
        department: 'อายุรกรรม',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        roomNumber: '201',
        floor: '2',
        department: 'ศัลยกรรม',
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '4',
        roomNumber: '202',
        floor: '2',
        department: 'ศัลยกรรม',
        isActive: false,
        createdAt: '2024-02-01'
      }
    ];
    setRooms(mockRooms);
    setFilteredRooms(mockRooms);
  }, []);

  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchTerm, rooms]);

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      floor: '',
      department: ''
    });
  };

  const handleAddRoom = () => {
    if (!formData.roomNumber || !formData.floor || !formData.department) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      roomNumber: formData.roomNumber,
      floor: formData.floor,
      department: formData.department,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRooms(prev => [...prev, newRoom]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "สำเร็จ",
      description: "เพิ่มห้องตรวจใหม่เรียบร้อยแล้ว",
    });
  };

  const handleEditRoom = () => {
    if (!selectedRoom || !formData.roomNumber || !formData.floor || !formData.department) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    setRooms(prev => prev.map(room =>
      room.id === selectedRoom.id
        ? { ...room, roomNumber: formData.roomNumber, floor: formData.floor, department: formData.department }
        : room
    ));

    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    resetForm();
    toast({
      title: "สำเร็จ",
      description: "แก้ไขข้อมูลห้องตรวจเรียบร้อยแล้ว",
    });
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;

    setRooms(prev => prev.filter(room => room.id !== selectedRoom.id));
    setIsDeleteDialogOpen(false);
    setSelectedRoom(null);
    toast({
      title: "สำเร็จ",
      description: "ลบห้องตรวจเรียบร้อยแล้ว",
    });
  };

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      department: room.department
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const toggleRoomStatus = (roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, isActive: !room.isActive }
        : room
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="จัดการห้องตรวจ" showBack />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">จัดการห้องตรวจ</h2>
            <p className="text-muted-foreground">เพิ่ม แก้ไข และลบห้องตรวจในระบบ</p>
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
                เพิ่มห้องตรวจใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>เพิ่มห้องตรวจใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลห้องตรวจใหม่ในระบบ
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">หมายเลขห้อง</Label>
                    <Input
                      id="roomNumber"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                      placeholder="เช่น 101, 202"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">ชั้น</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                      placeholder="เช่น 1, 2, 3"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">แผนก</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="เช่น อายุรกรรม, ศัลยกรรม"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddRoom}>
                  เพิ่มห้องตรวจ
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
              placeholder="ค้นหาห้องตรวจ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการห้องตรวจทั้งหมด ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ห้องตรวจ</TableHead>
                  <TableHead>ชั้น</TableHead>
                  <TableHead>แผนก</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-lg">{room.roomNumber}</div>
                          <div className="text-sm text-muted-foreground">ห้องตรวจ</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>ชั้น {room.floor}</span>
                      </div>
                    </TableCell>
                    <TableCell>{room.department}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={room.isActive ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleRoomStatus(room.id)}
                      >
                        {room.isActive ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>{room.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(room)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(room)}
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

        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลห้องตรวจ</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลห้องตรวจในระบบ
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-roomNumber">หมายเลขห้อง</Label>
                  <Input
                    id="edit-roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-floor">ชั้น</Label>
                  <Input
                    id="edit-floor"
                    value={formData.floor}
                    onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">แผนก</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleEditRoom}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Room Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันการลบห้องตรวจ</DialogTitle>
              <DialogDescription>
                คุณต้องการลบห้องตรวจ "{selectedRoom?.roomNumber}" หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoom}>
                ลบห้องตรวจ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RoomManagement; 