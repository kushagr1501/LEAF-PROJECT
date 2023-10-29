import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Platform, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const cameraRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        const { status } = await Camera.getCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      }

      const imagePickerStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imagePickerStatus.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);




  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImage(photo);
      setShowImageOptions(true);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result);
      setShowImageOptions(true);
    }
  };




  const captureAgain = () => {
    setImage(null);
    setShowImageOptions(false);
  };
  const handleNext = () => {
    // Implement logic for what to do when "Next" is pressed
    // For example, you can navigate to another screen or perform an action
    // with the captured image.
  };

  return (
    <View style={styles.container}>
      {cameraPermission === null ? (
        <Text style={styles.text}>Requesting camera permission...</Text>
      ) : cameraPermission === false ? (
        <Text style={styles.text}>No access to camera</Text>
      ) : (
        <View style={styles.buttonContainer}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <View style={styles.imageOptions}>
                <TouchableOpacity style={styles.button} onPress={captureAgain}>
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={cameraType}
              autoFocus={Camera.Constants.AutoFocus.on}
            >
              <View style={styles.cameraButtonsContainer}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    setCameraType(
                      cameraType === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <Text style={styles.cameraButtonText}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={takePicture}
                >
                  <Text style={styles.cameraButtonText}>Take Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImage}
                >
                  <Text style={styles.cameraButtonText}>Pick Image</Text>
                </TouchableOpacity>
              </View>
            </Camera>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraButtonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cameraButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
  cameraButtonText: {
    fontSize: 18,
    color: 'white',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
  captureAgain: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgba(104, 238, 144, 0.4)',
    borderRadius: 50,
    padding: 15,
    width: 120, // Adjust the width as needed
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50
  },

  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
