import { Platform } from "react-native";
import { Models } from "./models";
import { Attendance, Department, Notification, User } from "./types";

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

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`);
    const data = await response.json();
    return Models.user(data);
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

  signup: async (userData: Partial<User> ): Promise<User> => {
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
        department: userData.department || null,
        role: userData.role || "USER",
        isActive: userData.isActive || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    return Models.user(await response.json());
  },

  deleteUser: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  },




  // DEPARTEMENTS CRUD 

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

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error('Update failed');

    return Models.user(await response.json());
  },


  // ATTENDANCE CRUD 

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


  // NOTIFICATIONS CRUD 

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

  updateNotification: async (id: string, notifData: Partial<Notification>): Promise<Notification> => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...notifData,
      }),
    });
    return Models.notification(await response.json());
  },

  deleteNotification: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/notifications/${id}`, { method: 'DELETE' });
  },

};


