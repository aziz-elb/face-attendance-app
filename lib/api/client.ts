import axios from 'axios';
import { Platform } from 'react-native';

// ✅ MODIFIÉ : Configuration de l'URL de base selon l'environnement
export const SERVER_IP = "192.168.214.44"; // IP locale pour l'appareil physique Android
const API_URL = Platform.OS === "android" ? `http://${SERVER_IP}:3000` : "http://localhost:3000";
// Note: Utilisez votre IP locale (ex: 192.168.1.8) si vous testez sur un appareil physique Android

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ MODIFIÉ : Intercepteur pour extraire automatiquement 'data' et gérer les erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Le backend retourne { data: ..., message: ... }
    // On extrait directement le champ 'data' pour simplifier l'usage dans api.ts
    return response.data.data; 
  },
  (error) => {
    // Gestion centralisée des erreurs selon les spécifications du backend
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data.error || "Une erreur est survenue";

      switch (status) {
        case 400: throw new Error(errorMessage || "Requête invalide");
        case 401: throw new Error(errorMessage || "Email ou mot de passe invalide");
        case 403: throw new Error(errorMessage || "Compte désactivé ou accès refusé");
        case 404: throw new Error(errorMessage || "Ressource non trouvée");
        case 409: throw new Error(errorMessage || "Conflit - la ressource existe déjà");
        default: throw new Error(errorMessage || `Erreur serveur (${status})`);
      }
    }
    throw new Error(error.message || "Erreur de connexion au serveur");
  }
);

export default apiClient;
