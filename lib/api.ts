import { Platform } from "react-native";
import { User, Department, Attendance, Notification } from "./types";
import { Models } from "./models";

const API_URL = Platform.OS === "android" ? "http://192.168.1.8:3000" : "http://localhost:3000"; 
// Note: 10.0.2.2 is the default IP for Android Emulator to access localhost. 
// For physical devices, use the machine's local IP (e.g., 192.168.x.x).

export const api = {
  currentUser: null as User | null,

  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(Models.user) : [];
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
    const users = await response.json();
    if (Array.isArray(users) && users.length > 0) {
      const user = Models.user(users[0]);
      if (user.isActive === false) {
        throw new Error("Your account is deactivated. Please contact the administrator.");
      }
      return user;
    }
    throw new Error("Invalid email or password");
  },
  
  signup: async (userData: Partial<User> & { department_id?: string }): Promise<User> => {
    const existingResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
    const existingUsers = await existingResponse.json();
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error("User with this email already exists");
    }
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        department: userData.department || "Unknown",
        role: userData.role || "USER",
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    return Models.user(await response.json());
  },

  getDepartments: async (): Promise<Department[]> => {
    const response = await fetch(`${API_URL}/departments`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(Models.department) : [];
  },

  addDepartment: async (dept: Partial<Department>): Promise<Department> => {
    const response = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dept, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
    });
    return Models.department(await response.json());
  },

  updateDepartment: async (id: string | number, dept: Partial<Department>): Promise<Department> => {
    const response = await fetch(`${API_URL}/departments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dept, updatedAt: new Date().toISOString() }),
    });
    return Models.department(await response.json());
  },

  deleteDepartment: async (id: string | number): Promise<void> => {
    await fetch(`${API_URL}/departments/${id}`, { method: 'DELETE' });
  },

  updateUser: async (id: string, userData: Partial<User> & { department_id?: string }): Promise<User> => {
    let normalizedData: any = { ...userData };
    
    if (userData.department_id && !userData.department) {
      try {
        const depts = await api.getDepartments();
        const dept = depts.find(d => String(d.id) === String(userData.department_id));
        if (dept) {
          normalizedData.department = { id: dept.id, title: dept.title };
          delete normalizedData.department_id;
        }
      } catch (e) {
        normalizedData.department = { id: userData.department_id, title: "Unknown" };
      }
    }
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...normalizedData, updatedAt: new Date().toISOString() }),
    });
    return Models.user(await response.json());
  },

  deleteUser: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  },

  getAttendance: async (): Promise<Attendance[]> => {
    const response = await fetch(`${API_URL}/attendance`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(Models.attendance) : [];
  },

  addAttendance: async (attendanceData: Partial<Attendance>): Promise<Attendance> => {
    const response = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...attendanceData,
        is_justified: attendanceData.is_justified || false,
        justification: attendanceData.justification || null,
        createdAt: new Date().toISOString(),
      }),
    });
    return Models.attendance(await response.json());
  },

  getNotifications: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/notifications`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(Models.notification) : [];
  },

  addNotification: async (notifData: Partial<Notification>): Promise<Notification> => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...notifData,
        status: "Unread",
        isArchived: false,
        createdAt: new Date().toISOString(),
      }),
    });
    return Models.notification(await response.json());
  },
  updateAttendance: async (id: string, attendanceData: Partial<Attendance>): Promise<Attendance> => {
    const response = await fetch(`${API_URL}/attendance/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...attendanceData,
      }),
    });
    return Models.attendance(await response.json());
  },
};


