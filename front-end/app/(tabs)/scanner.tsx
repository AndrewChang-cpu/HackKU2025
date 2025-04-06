import { useRoute } from '@react-navigation/native';
import { View, Text, Button } from 'react-native';
import { useEffect, useState } from 'react';

export default function ScannerScreen({ navigation }) {
  const route = useRoute();
  const [barcode, setBarcode] = useState<string | null>(null);

  useEffect(() => {
    if (route.params && route.params.scanned) {
      setBarcode(route.params.scanned as string);
    }
  }, [route.params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Scanned barcode: {barcode ?? 'None yet'}</Text>
      <Button title="Scan Barcode" onPress={() => navigation.navigate('CameraScreen')} />
    </View>
  );
}
