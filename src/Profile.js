import { Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../config'; // Import the updated Firebase config
import { collection, doc, getDoc } from 'firebase/firestore';

const Profile = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const uid = user.uid;
					console.log(uid);
                    const userDocRef = doc(db,'users',uid); // Reference to the user document
                    const userDocSnapshot = await getDoc(userDocRef); // Get the user document
					if (userDocSnapshot.exists()) {
						console.log("Document data:", userDocSnapshot.data());
						await setName(userDocSnapshot.data().firstName);
					} else {
						// docSnap.data() will be undefined in this case
						console.log("No such document!");				
                }
			}
            } catch (error) {
                console.error('Firestore error: ', error);
            }
        };

        fetchData();
    }, []);

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
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                Hello, {name}
            </Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Sign Out</Text>
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
        marginTop: 50,
        height: 70,
        width: 250,
        backgroundColor: '#026efd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
});
