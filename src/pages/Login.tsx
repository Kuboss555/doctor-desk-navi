import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Stethoscope, User, Lock, Users, Building2, Home } from 'lucide-react';

export const Login = () => {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        // Don't navigate automatically, let user choose where to go
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    // This will be handled by the auth context
    window.location.reload();
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  เข้าสู่ระบบสำเร็จ
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  ยินดีต้อนรับ {formData.username} กรุณาเลือกหน้าที่ต้องการจัดการ
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Management */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/users')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">จัดการผู้ใช้</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      เพิ่ม แก้ไข และลบผู้ใช้ในระบบ
                    </p>
                    <Button className="w-full" variant="outline">
                      เข้าสู่หน้าจัดการ
                    </Button>
                  </CardContent>
                </Card>

                {/* Room Management */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/rooms')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">จัดการห้องตรวจ</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      จัดการหมายเลขห้อง ชั้น และแผนก
                    </p>
                    <Button className="w-full" variant="outline">
                      เข้าสู่หน้าจัดการ
                    </Button>
                  </CardContent>
                </Card>

                {/* Doctor Management */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/doctors')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">จัดการแพทย์</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      จัดการข้อมูลแพทย์และจัดสรรห้องตรวจ
                    </p>
                    <Button className="w-full" variant="outline">
                      เข้าสู่หน้าจัดการ
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  กลับไปหน้าแรก
                </Button>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                ระบบจัดการคิวแพทย์
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                เข้าสู่ระบบเพื่อจัดการคิวและข้อมูลผู้ป่วย
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </div>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                สำหรับเจ้าหน้าที่และแพทย์เท่านั้น
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 