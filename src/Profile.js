import { Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db , storage } from '../config'; // Import the updated Firebase config
import {ref , uploadBytes , uploadBytesResumable , getDownloadURL } from 'firebase/storage';
import { collection, doc, getDoc , setDoc  } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from your library
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [email, setEmail] = useState('');
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const uid = user.uid;
                    console.log(uid);
                    const userDocRef = doc(db, 'users', uid); // Reference to the user document
                    const userDocSnapshot = await getDoc(userDocRef); // Get the user document
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        console.log("Document data:", userData);
                        setName(userData.fullName);
                        setEmail(userData.email); // Set the email
                        // Retrieve the profile picture URL and set it in the state
                        if (userData.profilePicture) {
                            const url = await getDownloadURL(ref(storage , userData.profilePicture));

                            setProfilePicture(url);
                        }
                    } else {
                        console.log("No such document!");
                    }
                }
            } catch (error) {
                console.error('Firestore error: ', error);
            }
        };

        fetchData();
    }, []);

    // Function to handle profile picture uploads
    const handleProfilePictureUpload = async (imageUri) => {
        try {
            // Upload the image to Firebase Storage
            const user = auth.currentUser;
            const uid = user.uid;
            const imageRef = ref(storage, `profilePictures/${uid}.jpeg`);

            const metadata = {
                contentType: 'image/jpeg',
              };

            const response = await fetch(imageUri);
            const blob = await response.blob();

            

            uploadBytesResumable(imageRef, blob ,metadata ).then((snapshot) => {
                console.log(`Uploaded a blob or file!: ${snapshot.ref.fullPath}}}`);
              });
              
        
            
            // Update the user's Firestore document with the profile picture reference
            const userDocRef = doc(db, 'users', uid);
            await setDoc(userDocRef, {
                profilePicture: `profilePictures/${uid}.jpeg`,
            }, { merge: true 
            });

            // Update the profile picture state


            const url = getDownloadURL(ref(storage , `profilePictures/${uid}`));
            if (url)
            {
                setProfilePicture(url);
            }
                
        } catch (error) {
            console.error('Profile picture upload error: ', error);
        }
    };

    const handleProfilePictureClick = async () => {
        try {
            // Open the image picker
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

            console.log(result);

    
            if (!result.canceled) {
                // 'result' contains information about the selected image
                const { uri } = result.assets[0];
                // Call the function to upload the selected image as a profile picture
                handleProfilePictureUpload(uri);
            }
            if (result.canceled) {
                alert("No image selected");
            }
        } catch (error) {
            alert("Error while uploading image");
            console.error('Image picker error:', error);
        }
    };

    
    const renderProfilePicture = () => {
    if (profilePicture) {
        return (
            <TouchableOpacity onPress={handleProfilePictureClick}>
                <Image source={{uri: profilePicture }} style={styles.profilePicture} />
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity onPress={handleProfilePictureClick} style={styles.iconContainer}>
                <Ionicons name="person-circle" size={100} color="grey"/>
            </TouchableOpacity>
        );
    }
};


    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                // Sign out successful
            })
            .catch((error) => {
                console.error('Sign out error: ', error);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderProfilePicture()}
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                Hello, {name}
            </Text>
            <Text style={{ fontSize: 18 }}>Email: {email}</Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 20,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    textInput: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 400,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        marginTop: 250,
        height: 50,
        width: 150,
        backgroundColor: '#026efd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    }
});
