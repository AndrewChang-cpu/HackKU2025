import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    // Navigate back and pass the scanned barcode
    navigation.navigate('HomeScreen', { scanned: data });
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (permission.status !== 'granted') {
    return <Text>Camera access denied.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'code128', 'qr'],
        }}
      />
    </View>
  );
}
