import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  th: {
    // Navigation
    dashboard: 'แดชบอร์ด',
    management: 'จัดการคิว',
    
    // Dashboard
    departmentOverview: 'ภาพรวมแผนก',
    totalRooms: 'ห้องตรวจทั้งหมด',
    activeDoctors: 'แพทย์ที่ปฏิบัติหน้าที่',
    currentQueues: 'คิวปัจจุบัน',
    queueStatus: 'สถานะคิว',
    currentQueue: 'คิวปัจจุบัน',
    room: 'ห้อง',
    doctor: 'แพทย์',
    queue: 'คิว',
    
    // Management
    patientManagement: 'จัดการผู้ป่วย',
    doctorManagement: 'จัดการแพทย์',
    searchPatient: 'ค้นหาผู้ป่วย (HN)',
    addQueue: 'เพิ่มคิว',
    moveQueue: 'ย้ายคิว',
    deleteQueue: 'ลบคิว',
    addDoctor: 'เพิ่มแพทย์',
    moveDoctor: 'ย้ายแพทย์',
    removeDoctor: 'ลบแพทย์',
    callQueue: 'เรียกคิว',
    
    // Status
    active: 'กำลังตรวจ',
    waiting: 'รอคิว',
    completed: 'เสร็จสิ้น',
    
    // Common
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    close: 'ปิด',
    search: 'ค้นหา',
    refresh: 'รีเฟรช',
    
    // Time
    lastUpdated: 'อัปเดตล่าสุด',
    autoRefresh: 'อัปเดตอัตโนมัติ'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    management: 'Queue Management',
    
    // Dashboard
    departmentOverview: 'Department Overview',
    totalRooms: 'Total Rooms',
    activeDoctors: 'Active Doctors',
    currentQueues: 'Current Queues',
    queueStatus: 'Queue Status',
    currentQueue: 'Current Queue',
    room: 'Room',
    doctor: 'Doctor',
    queue: 'Queue',
    
    // Management
    patientManagement: 'Patient Management',
    doctorManagement: 'Doctor Management',
    searchPatient: 'Search Patient (HN)',
    addQueue: 'Add Queue',
    moveQueue: 'Move Queue',
    deleteQueue: 'Delete Queue',
    addDoctor: 'Add Doctor',
    moveDoctor: 'Move Doctor',
    removeDoctor: 'Remove Doctor',
    callQueue: 'Call Queue',
    
    // Status
    active: 'In Progress',
    waiting: 'Waiting',
    completed: 'Completed',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    search: 'Search',
    refresh: 'Refresh',
    
    // Time
    lastUpdated: 'Last Updated',
    autoRefresh: 'Auto Refresh'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['th']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};