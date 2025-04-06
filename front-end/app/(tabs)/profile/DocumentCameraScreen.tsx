import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import supabase from '@/api/supabaseClient';
import { useAuth } from '@/contexts/UserContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function DocumentCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      setCapturedUri(photo.uri);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!capturedUri || !user) return;

    try {
      const fileExt = capturedUri.split('.').pop() || 'jpg';
      const fileName = `${uuidv4()}.${fileExt}`;

      // Read image as base64
      const base64Data = await FileSystem.readAsStringAsync(capturedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload to Supabase documents table
      const { error } = await supabase.from('documents').insert({
        user_id: user.id,
        file_name: fileName,
        file_data: base64Data,
      });

      if (error) throw error;

      router.push('/(tabs)/profile/documents');
    } catch (err: any) {
      console.error('Upload failed:', err);
      Alert.alert('Upload Failed', err.message || 'An error occurred while uploading.');
    }
  };

  const handleBack = () => {
    router.push('/(tabs)/profile/documents');
  };

  const reset = () => setCapturedUri(null);

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (permission.status !== 'granted') return <Text>Camera access denied.</Text>;

  return (
    <View style={{ flex: 1 }}>
      {capturedUri ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 12 }}>Captured Document:</Text>
          <Image
            source={{ uri: capturedUri }}
            style={{ width: '90%', height: '70%', borderRadius: 10, marginBottom: 16 }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={reset}
              style={{
                backgroundColor: '#ccc',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#000' }}>Retake / Upload New</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#007b55',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#000' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView style={{ flex: 1 }} ref={cameraRef}>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
            <TouchableOpacity
              onPress={handleTakePicture}
              style={{
                backgroundColor: '#000000aa',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                backgroundColor: '#ffffffcc',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#000', fontSize: 16 }}>Upload from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              style={{
                backgroundColor: '#ff4d4d',
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}
