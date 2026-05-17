import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, Platform } from 'react-native';
import { Appbar, Button, Text, useTheme, Card, ActivityIndicator, TextInput, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../lib/api';

export default function UploadPhoto() {
  const { colors } = useTheme();
  const [studentId, setStudentId] = useState(api.currentUser?.id || '');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentBase64, setCurrentBase64] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const msg = 'Sorry, we need camera roll permissions to make this work!';
      if (Platform.OS === 'web') {
        window.alert(`Permission refusée: ${msg}`);
      } else {
        Alert.alert('Permission denied', msg);
      }
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      return result.assets[0].base64;
    }
    return null;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      const msg = 'Sorry, we need camera permissions to make this work!';
      if (Platform.OS === 'web') {
        window.alert(`Permission refusée: ${msg}`);
      } else {
        Alert.alert('Permission denied', msg);
      }
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      return result.assets[0].base64;
    }
    return null;
  };

  const handleUpload = async () => {
    if (!studentId.trim()) {
      const msg = "Veuillez entrer l'ID de l'étudiant";
      if (Platform.OS === 'web') {
        window.alert(`Erreur: ${msg}`);
      } else {
        Alert.alert('Erreur', msg);
      }
      return;
    }
    if (!image) {
      const msg = 'Veuillez sélectionner ou capturer une photo';
      if (Platform.OS === 'web') {
        window.alert(`Erreur: ${msg}`);
      } else {
        Alert.alert('Erreur', msg);
      }
      return;
    }

    setUploading(true);
    try {
      // Try to get department from currentUser if they are registering themselves
      const deptId = studentId.trim() === api.currentUser?.id ? api.currentUser?.department : undefined;
      const response = await api.registerFace(studentId.trim(), image, deptId);

      // Display success message with response and student ID
      const successMsg = response?.message || `L'étudiant ${studentId.trim()} a été enregistré avec succès !`;
      if (Platform.OS === 'web') {
        window.alert(`Succès: ${successMsg}`);
      } else {
        Alert.alert('Succès', successMsg);
      }
      router.back();
    } catch (error: any) {
      console.error("Upload error:", error);
      const errMsg = error.message || "Une erreur est survenue lors de la communication avec le serveur.";
      if (Platform.OS === 'web') {
        window.alert(`Erreur d'enregistrement: ${errMsg}`);
      } else {
        Alert.alert('Erreur d\'enregistrement', errMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Enregistrement Étudiant" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoSection}>
          <Text variant="titleMedium" style={[styles.title, { color: colors.primary }]}>
            Reconnaissance Faciale
          </Text>
  
        </View>

        <View style={[styles.formGroup , {display: 'none'}]}>
          <TextInput
            label="ID de l'étudiant (ex: 661fbe234a123bc456789def)"
            value={studentId}
            onChangeText={setStudentId}
            mode="outlined"
            placeholder="Entrez l'identifiant unique"
            left={<TextInput.Icon icon="account-key" />}
            style={styles.input}
            disabled={uploading}
            textColor={colors.onSurface}
          />
          <Text variant="bodySmall" style={[styles.helperText, { color: colors.outline }]}>
            Doit correspondre à un identifiant unique (ex: Mongoose ObjectId)
          </Text>
        </View>

        <View style={styles.imageCard}>
          {image ? (
            Platform.OS === 'web' ? (
              <img 
                src={image} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Preview" 
              />
            ) : (
              <Image source={{ uri: image }} style={styles.previewImage} />
            )
          ) : (
            <View style={[styles.placeholder, { backgroundColor: colors.surfaceVariant }]}>
              <Avatar.Icon size={64} icon="face-recognition" style={{ backgroundColor: 'transparent' }} color={colors.outline} />
              <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
                Aucune photo sélectionnée
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonGrid}>
          <Button 
            mode="outlined" 
            onPress={async () => {
              const b64 = await pickImage();
              if (b64) setCurrentBase64(b64);
            }} 
            style={styles.button}
            icon="image"
            disabled={uploading}
          >
            Galerie
          </Button>
          <Button 
            mode="outlined" 
            onPress={async () => {
              const b64 = await takePhoto();
              if (b64) setCurrentBase64(b64);
            }} 
            style={styles.button}
            icon="camera"
            disabled={uploading}
          >
            Caméra
          </Button>
        </View>

        <Button 
          mode="contained" 
          onPress={handleUpload} 
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          disabled={!image || uploading || !studentId.trim()}
          loading={uploading}
        >
          Enregistrer l'empreinte faciale
        </Button>
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
  infoSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  imageCard: {
    width: '100%',
    height: 300,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    padding: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  button: {
    flex: 0.48,
  },
  uploadButton: {
    width: '100%',
    paddingVertical: 6,
    borderRadius: 12,
  },
});
