import { User, Department, Attendance, Notification, DepartmentRef } from './types';

export const Models = {
  /**
   * Normalizes a user object from the API/DB
   */
  user: (data: any): User => {
    let department: DepartmentRef | null = null;

    if (data.department) {
      department = {
        id: data.department.id,
        title: data.department.title
      };
    }

    return {
      id: String(data.id || ''),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      password: data.password,
      role: data.role || 'USER',
      department: department,
      isActive: data.isActive ?? false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  },

  /**
   * Normalizes a department object
   */
  department: (data: any): Department => ({
    id: data.id,
    title: data.title || '',
    description: data.description || '',
    code: data.code || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  }),

  /**
   * Normalizes an attendance object
   */
  attendance: (data: any): Attendance => ({
    id: String(data.id || ''),
    user_id: String(data.user_id || ''),
    date: data.date || new Date().toISOString().split('T')[0],
    status: data.status || 'ABSENT',
    is_justified: data.is_justified ?? false,
    justification: data.justification || null,
    createdAt: data.createdAt || new Date().toISOString(),
  }),

  /**
   * Normalizes a notification object
   */
  notification: (data: any): Notification => ({
    id: String(data.id || ''),
    recipient_id: String(data.recipient_id || ''),
    sender_id: String(data.sender_id || ''),
    content: data.content || '',
    status: data.status || 'Unread',
    isArchived: data.isArchived ?? false,
    createdAt: data.createdAt || new Date().toISOString(),
  }),
};
