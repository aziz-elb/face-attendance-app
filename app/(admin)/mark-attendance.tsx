import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, Platform } from 'react-native';
import { Appbar, Button, Text, useTheme, Card, ActivityIndicator, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../lib/api';

export default function MarkAttendanceFaces() {
  const { colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const performMatching = async (selectedImageUri: string) => {
    setImage(selectedImageUri);
    setLoading(true);
    setStatus('idle');
    setStudentId(null);
    setStudentName(null);
    setErrorMsg(null);

    try {
      // Call the match API (now fully cross-platform and web-compatible)
      const res = await api.matchFace(selectedImageUri);
      if (res && res.status === 'success') {
        setStatus('success');
        setStudentId(res.student_id);
        setStudentName(res.full_name || null);
        
        // Show success alert
        const successMsg = res.message || `Match! Présence enregistrée pour ${res.full_name || 'l\'étudiant'}.`;
        if (Platform.OS === 'web') {
          window.alert(`Succès: ${successMsg}`);
        } else {
          Alert.alert('Succès', successMsg);
        }
      } else {
        setStatus('failed');
        const failMsg = 'Réponse invalide du serveur.';
        setErrorMsg(failMsg);
        if (Platform.OS === 'web') {
          window.alert(`Échec: ${failMsg}`);
        } else {
          Alert.alert('Échec de scan', failMsg);
        }
      }
    } catch (error: any) {
      console.error("Match error:", error);
      setStatus('failed');
      const failMsg = error.message || 'Visage non reconnu ou erreur de liaison.';
      setErrorMsg(failMsg);
      if (Platform.OS === 'web') {
        window.alert(`Échec: ${failMsg}`);
      } else {
        Alert.alert('Échec de scan', failMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const takePhotoAndMatch = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      const msg = 'L\'accès à la caméra est requis pour scanner les visages !';
      if (Platform.OS === 'web') {
        window.alert(`Permission refusée: ${msg}`);
      } else {
        Alert.alert('Permission refusée', msg);
      }
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;
    await performMatching(result.assets[0].uri);
  };

  const pickImageAndMatch = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus !== 'granted') {
      const msg = 'L\'accès à la galerie est requis pour sélectionner une image !';
      if (Platform.OS === 'web') {
        window.alert(`Permission refusée: ${msg}`);
      } else {
        Alert.alert('Permission refusée', msg);
      }
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;
    await performMatching(result.assets[0].uri);
  };

  const handleCloseSession = async () => {
    const adminDeptId = api.currentUser?.department;
    if (!adminDeptId) {
      const msg = "Impossible de récupérer le département de l'administrateur.";
      if (Platform.OS === 'web') {
        window.alert(`Erreur: ${msg}`);
      } else {
        Alert.alert('Erreur', msg);
      }
      return;
    }
    setClosing(true);
    try {
      const response = await api.closeAttendanceSession(adminDeptId);
      const successMsg = response?.message || 'La session de présence a été clôturée avec succès et les absents ont été marqués !';
      if (Platform.OS === 'web') {
        window.alert(`Session Clôturée: ${successMsg}`);
        router.replace('/(admin)/attendance');
      } else {
        Alert.alert(
          'Session Clôturée',
          successMsg,
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(admin)/attendance');
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error("Close session error:", error);
      const errMsg = error.message || 'Impossible de clore la session de présence. Assurez-vous que le serveur est actif.';
      if (Platform.OS === 'web') {
        window.alert(`Erreur: ${errMsg}`);
      } else {
        Alert.alert('Erreur', errMsg);
      }
    } finally {
      setClosing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Scanner Facial" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status card */}
        <Card style={styles.statusCard}>
          <Card.Content style={styles.cardContent}>
            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text variant="bodyLarge" style={[styles.statusText, { marginTop: 16, color: colors.onSurfaceVariant }]}>
                  Analyse du visage en cours, veuillez patienter...
                </Text>
              </View>
            ) : (
              <View style={styles.centered}>
                <Avatar.Icon 
                  size={64} 
                  icon="camera-account" 
                  style={{ backgroundColor: colors.secondaryContainer }} 
                  color={colors.onSecondaryContainer} 
                />
                <Text variant="titleMedium" style={{ marginTop: 16, fontWeight: 'bold', color: colors.onSurface }}>
                  Prêt à scanner
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, color: colors.onSurfaceVariant, textAlign: 'center' }}>
                  Prenez une photo ou sélectionnez-en une dans la galerie pour marquer automatiquement la présence d'un étudiant.
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {image && (
          <View style={styles.imageCard}>
            {Platform.OS === 'web' ? (
              <img 
                src={image} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Preview" 
              />
            ) : (
              <Image source={{ uri: image }} style={styles.previewImage} />
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.buttonGrid}>
            <Button
              mode="contained"
              icon="camera"
              onPress={takePhotoAndMatch}
              style={styles.actionButton}
              contentStyle={{ paddingVertical: 8 }}
              disabled={loading || closing}
            >
              Caméra
            </Button>
            <Button
              mode="contained"
              icon="image"
              onPress={pickImageAndMatch}
              style={styles.actionButton}
              contentStyle={{ paddingVertical: 8 }}
              disabled={loading || closing}
            >
              Galerie
            </Button>
          </View>

          <Button
            mode="outlined"
            icon="close-circle"
            onPress={handleCloseSession}
            style={[styles.closeButton, { borderColor: colors.error }]}
            textColor={colors.error}
            contentStyle={{ paddingVertical: 8 }}
            disabled={loading || closing}
            loading={closing}
          >
            Clore la session de présence
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  statusCard: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 16,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
    minHeight: 180,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    width: '100%',
  },
  successContainer: {
    backgroundColor: '#e8f5e9', // light green
    padding: 16,
  },
  failedContainer: {
    backgroundColor: '#ffebee', // light red
    padding: 16,
  },
  successIcon: {
    backgroundColor: '#4caf50', // green
    marginBottom: 12,
  },
  failedIcon: {
    backgroundColor: '#f44336', // red
    marginBottom: 12,
  },
  successTextTitle: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successTextDesc: {
    color: '#1b5e20',
    marginBottom: 4,
  },
  successTextSub: {
    color: '#388e3c',
    textAlign: 'center',
  },
  failedTextTitle: {
    color: '#c62828',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  failedTextDesc: {
    color: '#b71c1c',
    textAlign: 'center',
  },
  imageCard: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    padding: 0,
    height: '100%',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 12,
  },
  closeButton: {
    borderRadius: 12,
    width: '100%',
  },
});
