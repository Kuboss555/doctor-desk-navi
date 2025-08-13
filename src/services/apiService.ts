// Mock API service for queue management system
// This will be replaced with actual API calls in production

export interface Patient {
  id: string;
  hn: string;
  name: string;
  roomId?: string;
  queueNumber?: number;
  status: 'waiting' | 'active' | 'completed';
  arrivalTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  roomId: string;
  specialization?: string;
  isActive: boolean;
}

export interface Room {
  id: string;
  name: string;
  currentQueue?: number;
  doctorId?: string;
  status: 'active' | 'inactive';
}

export interface QueueData {
  rooms: Room[];
  doctors: Doctor[];
  patients: Patient[];
}

// Mock data
const mockRooms: Room[] = [
  { id: '1', name: 'ห้อง 1', currentQueue: 5, doctorId: '1', status: 'active' },
  { id: '2', name: 'ห้อง 2', currentQueue: 3, doctorId: '2', status: 'active' },
  { id: '3', name: 'ห้อง 3', currentQueue: 7, doctorId: '3', status: 'active' },
  { id: '4', name: 'ห้อง 4', currentQueue: 2, doctorId: '4', status: 'active' },
];

const mockDoctors: Doctor[] = [
  { id: '1', name: 'นพ.สมชาย ใจดี', roomId: '1', specialization: 'อายุรกรรม', isActive: true },
  { id: '2', name: 'พญ.สมใส สวยงาม', roomId: '2', specialization: 'กุมารเวช', isActive: true },
  { id: '3', name: 'นพ.วิชาญ รู้มาก', roomId: '3', specialization: 'ศัลยกรรม', isActive: true },
  { id: '4', name: 'พญ.จินดา ช่วยเหลือ', roomId: '4', specialization: 'สูติกรรม', isActive: true },
];

const mockPatients: Patient[] = [
  { id: '1', hn: 'HN001234', name: 'นายสมศักดิ์ ใจดี', roomId: '1', queueNumber: 5, status: 'active', arrivalTime: '09:30' },
  { id: '2', hn: 'HN001235', name: 'นางสาวสุภาพ ดีงาม', roomId: '1', queueNumber: 6, status: 'waiting', arrivalTime: '09:45' },
  { id: '3', hn: 'HN001236', name: 'นายประพันธ์ รักเรียน', roomId: '2', queueNumber: 3, status: 'active', arrivalTime: '08:15' },
  { id: '4', hn: 'HN001237', name: 'นางวิไล ใจซื่อ', roomId: '2', queueNumber: 4, status: 'waiting', arrivalTime: '10:00' },
  { id: '5', hn: 'HN001238', name: 'นายสมชาย หาญกล้า', roomId: '3', queueNumber: 7, status: 'active', arrivalTime: '08:30' },
  { id: '6', hn: 'HN001239', name: 'นางสาวมณี อ่อนหวาน', roomId: '4', queueNumber: 2, status: 'active', arrivalTime: '09:00' },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Dashboard API
  async getDashboardData(): Promise<QueueData> {
    await delay(500);
    return {
      rooms: mockRooms,
      doctors: mockDoctors,
      patients: mockPatients
    };
  },

  // Patient Management API
  async getPatients(): Promise<Patient[]> {
    await delay(300);
    return mockPatients;
  },

  async searchPatient(hn: string): Promise<Patient | null> {
    await delay(300);
    return mockPatients.find(p => p.hn.includes(hn)) || null;
  },

  async addQueue(patientHn: string, roomId: string): Promise<boolean> {
    await delay(500);
    console.log(`Adding queue for patient ${patientHn} to room ${roomId}`);
    return true;
  },

  async moveQueue(patientId: string, newRoomId: string): Promise<boolean> {
    await delay(500);
    console.log(`Moving patient ${patientId} to room ${newRoomId}`);
    return true;
  },

  async deleteQueue(patientId: string): Promise<boolean> {
    await delay(500);
    console.log(`Deleting queue for patient ${patientId}`);
    return true;
  },

  // Doctor Management API
  async getDoctors(): Promise<Doctor[]> {
    await delay(300);
    return mockDoctors;
  },

  async addDoctor(name: string, roomId: string, specialization: string): Promise<boolean> {
    await delay(500);
    console.log(`Adding doctor ${name} to room ${roomId}`);
    return true;
  },

  async moveDoctor(doctorId: string, newRoomId: string): Promise<boolean> {
    await delay(500);
    console.log(`Moving doctor ${doctorId} to room ${newRoomId}`);
    return true;
  },

  async removeDoctor(doctorId: string): Promise<boolean> {
    await delay(500);
    console.log(`Removing doctor ${doctorId}`);
    return true;
  },

  // Audio API
  async callQueue(roomId: string, queueNumber: number): Promise<boolean> {
    await delay(300);
    console.log(`Calling queue ${queueNumber} for room ${roomId}`);
    // In real implementation, this would trigger server-side audio announcement
    return true;
  }
};