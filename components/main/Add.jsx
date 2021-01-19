import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'

export default function App() {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const cameraStatus = await Camera.requestPermissionsAsync();
                setHasCameraPermission(cameraStatus.status === 'granted');
            } catch (error) {
                console.error(error)
                setHasCameraPermission(null)
            }

            try {
                const galleryStatus = await ImagePicker.requestCameraPermissionsAsync()
                setHasGalleryPermission(galleryStatus.status === 'granted')
            } catch (error) {
                console.error(error)
                setHasGalleryPermission(null)
            }
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            console.log(data.uri)
            setImage(data.uri)
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        console.log(result)

        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <Camera
                    style={styles.fixedRatio}
                    ratio={'1:1'}
                    ref={ref => setCamera(ref)}
                    type={type} />
            </View>

            <Button
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    )
                }}
                title="Flip the camera"
            >
            </Button>
            <Button title="Take Picture" onPress={() => takePicture()} />
            <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
            {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRation: 1
    }
})
