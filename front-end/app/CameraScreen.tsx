import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import upcNdcMap from '../assets/upc_ndc_mapping.json';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    console.log('UPC:', typeof data, data);
    console.log(Object.keys(upcNdcMap).includes("0" + data))
  
console.log('Scanned UPC:', data);
      const matchedNdc = (upcNdcMap as Record<string, string>)["0" + data];
  
      if (!matchedNdc) {
        throw new Error('UPC not found in upcNdcMap');
      }
  
      // Query FDA API
      const response = await fetch(
        `https://api.fda.gov/drug/ndc.json?search=product_ndc:${matchedNdc}`
      );
      const result = await response.json();
  
      const ndcName = result.results?.[0]?.generic_name || 'Unknown Drug';
  
      navigation.navigate('AddMedicationScreen', {
        scanned: data,
        name: ndcName,
        dosage: '2 pills',
      });
    
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
