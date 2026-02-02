import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Scan({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    // Return permission request UI (Button to requestPermission)
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const vendorData = JSON.parse(data); // Expecting { "id": 1, "vendor_name": "Cafe" }
      navigation.navigate('ConfirmRedemption', { vendor: vendorData });
    } catch (e) {
      Alert.alert("Invalid QR", "Please scan a valid vendor QR code.");
    }
    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.overlay}><Text style={styles.text}>Scan Vendor QR</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontSize: 18, marginTop: 200, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 }
});