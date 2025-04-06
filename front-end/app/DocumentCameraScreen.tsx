import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DocumentCaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const navigation = useNavigation();

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
    if (!capturedUri) return;

    // TODO: implement actual submit logic
    await submitDocument(capturedUri);
    navigation.navigate('Profile'); // Go back to Profile screen
  };

  const submitDocument = async (uri: string) => {
    console.log('Submitting image:', uri);
    // Placeholder for upload / save logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleBack = () => {
    navigation.navigate('Profile');
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
