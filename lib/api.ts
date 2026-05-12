import { Models } from "./models";
import { Attendance, Department, Notification, User } from "./types";
import apiClient from "./api/client"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = {
  currentUser: null as User | null,

  // ========== UTILISATEURS ==========

  getUsers: async (): Promise<User[]> => {
    // ✅ MODIFIÉ : apiClient extrait déjà result.data via l'intercepteur
    const data = await apiClient.get('/users');
    return Array.isArray(data) ? data.map(Models.user) : [];
  },

  getUsersByDepartment: async (deptId: string): Promise<User[]> => {
    const data = await apiClient.get(`/users/department/${deptId}`);
    return Array.isArray(data) ? data.map(Models.user) : [];
  },

  getUser: async (id: string): Promise<User> => {
    // ✅ MODIFIÉ
    const data = await apiClient.get(`/users/${id}`);
    return Models.user(data);
  },

  login: async (email: string, password: string): Promise<User> => {
    // ✅ MODIFIÉ : Le backend utilise GET avec query params, pas POST !
    // L'URL devient /users?email=X&password=Y
    const userResult = await apiClient.get('/users', {
      params: { email, password }
    });

    // Le backend retourne { data: User } pour cette route login spéciale
    const user = Models.user(userResult);
    
    if (!user.isActive) {
      throw new Error("Your account is deactivated. Please contact the administrator.");
    }
    
    api.currentUser = user;
    await api.saveUser(user); // Sauvegarde locale
    return user;
  },

  saveUser: async (user: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.error("Error saving user", e);
    }
  },

  loadUser: async (): Promise<User | null> => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        api.currentUser = user;
        return user;
      }
    } catch (e) {
      console.error("Error loading user", e);
    }
    return null;
  },

  logoutLocal: async () => {
    try {
      await AsyncStorage.removeItem('user');
      api.currentUser = null;
    } catch (e) {
      console.error("Error clearing storage", e);
    }
  },

  signup: async (userData: Partial<User>): Promise<User> => {
    // ✅ MODIFIÉ
    const data = await apiClient.post('/users', {
      ...userData,
      role: userData.role || "USER",
      isActive: userData.isActive ?? false, // Par défaut désactivé selon les specs
    });
    return Models.user(data);
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // ✅ MODIFIÉ
    const data = await apiClient.patch(`/users/${id}`, userData);
    return Models.user(data);
  },

  deleteUser: async (id: string): Promise<void> => {
    // ✅ MODIFIÉ
    await apiClient.delete(`/users/${id}`);
  },

  // ========== DÉPARTEMENTS ==========

  getDepartments: async (): Promise<Department[]> => {
    // ✅ MODIFIÉ
    const data = await apiClient.get('/departments');
    return Array.isArray(data) ? data.map(Models.department) : [];
  },

  addDepartment: async (dept: Partial<Department>): Promise<Department> => {
    // ✅ MODIFIÉ
    const data = await apiClient.post('/departments', dept);
    return Models.department(data);
  },

  updateDepartment: async (id: string | number, dept: Partial<Department>): Promise<Department> => {
    // ✅ MODIFIÉ
    const data = await apiClient.patch(`/departments/${id}`, dept);
    return Models.department(data);
  },

  deleteDepartment: async (id: string | number): Promise<void> => {
    // ✅ MODIFIÉ
    await apiClient.delete(`/departments/${id}`);
  },

  // ========== PRÉSENCES (ATTENDANCE) ==========

  getAttendance: async (userId?: string): Promise<Attendance[]> => {
    // ✅ MODIFIÉ : Ajout du filtre optionnel par utilisateur
    const data = await apiClient.get('/attendance', {
      params: userId ? { user_id: userId } : {}
    });
    return Array.isArray(data) ? data.map(Models.attendance) : [];
  },

  addAttendance: async (attendanceData: Partial<Attendance>): Promise<Attendance> => {
    // ✅ MODIFIÉ
    const data = await apiClient.post('/attendance', attendanceData);
    return Models.attendance(data);
  },

  updateAttendance: async (id: string, attendanceData: Partial<Attendance>): Promise<Attendance> => {
    // ✅ MODIFIÉ
    const data = await apiClient.patch(`/attendance/${id}`, attendanceData);
    return Models.attendance(data);
  },

  // ========== NOTIFICATIONS ==========

  getNotifications: async (recipientId?: string): Promise<Notification[]> => {
    // ✅ MODIFIÉ : Ajout du filtre par destinataire
    const data = await apiClient.get('/notifications', {
      params: recipientId ? { recipient_id: recipientId } : {}
    });
    return Array.isArray(data) ? data.map(Models.notification) : [];
  },

  addNotification: async (notifData: Partial<Notification>): Promise<Notification> => {
    // ✅ MODIFIÉ
    const data = await apiClient.post('/notifications', notifData);
    return Models.notification(data);
  },

  updateNotification: async (id: string, notifData: Partial<Notification>): Promise<Notification> => {
    // ✅ MODIFIÉ
    const data = await apiClient.patch(`/notifications/${id}`, notifData);
    return Models.notification(data);
  },

  deleteNotification: async (id: string): Promise<void> => {
    // ✅ MODIFIÉ
    await apiClient.delete(`/notifications/${id}`);
  },
};
