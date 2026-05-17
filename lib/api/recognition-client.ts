import axios from 'axios';
import { Platform } from 'react-native';
import { SERVER_IP } from './client';

const RECOGNITION_URL = Platform.OS === "android" ? `http://${SERVER_IP}:8000` : "http://localhost:8000";

const recognitionClient = axios.create({
  baseURL: RECOGNITION_URL,
});

recognitionClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Recognition Service Error:", error);
    const serverMessage = 
      error.response?.data?.detail || 
      error.response?.data?.error || 
      error.response?.data?.message;
    throw new Error(serverMessage || "Error connecting to recognition service");
  }
);

export default recognitionClient;
