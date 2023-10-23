import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { auth, db } from '../config'; // Import the updated Firebase config
import { createUserWithEmailAndPassword , sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc } from "firebase/firestore"; 

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const signUpUser = async (email, password, firstName, lastName, phone) => {
        try {
            // Create a user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth,email, password);
            
            // Send email verification
            await sendEmailVerification( auth.currentUser,{
                handleCodeInApp: true,
                url: 'https://nlplegalbot.firebaseapp.com',
            });

            // Save user information to Firestore
            const userRef =  collection(db , 'users')
            
            await setDoc(doc(userRef, userCredential.user.uid), {
                firstName,
                lastName,
                phone,
                email,
            });

            alert('Registration successful. Email verification sent.');
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontWeight: 'bold', fontSize: 23 }}>
                Sign Up
            </Text>
            <View style={{ marginTop: 40 }}>
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    onChangeText={(firstName) => setFirstName(firstName)}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    onChangeText={(lastName) => setLastName(lastName)}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Phone"
                    onChangeText={(phone) => setPhone(phone)}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    onChangeText={(email) => setEmail(email)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>
            <TouchableOpacity
                onPress={() => signUpUser(email, password, firstName, lastName, phone)}
                style={styles.button}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUp;

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
        borderBottomColor: "#000",
        marginBottom: 10,
        textAlign: "center",
    },
    button: {
        marginTop: 50,
        height: 70,
        width: 250,
        backgroundColor: "#026efd",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    }
});
