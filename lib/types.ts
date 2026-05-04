export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';
export type JustificationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type NotificationStatus = 'Read' | 'Unread';

export interface DepartmentRef {
  id: string | number;
  title: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  department: DepartmentRef | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string | number;
  title: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Justification {
  message: string;
  file_path: string;
  status: JustificationStatus;
  isArchived: boolean;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  status: AttendanceStatus;
  is_justified: boolean;
  justification: Justification | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string;
  content: string;
  status: NotificationStatus;
  isArchived: boolean;
  createdAt: string;
}

// Unified API Response Type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
