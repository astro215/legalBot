import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password); // Use await to get the userCredential
            const user = userCredential.user;
            console.log(user);
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'left' }}>Login</Text>
            <View style={{ marginTop: 40 }}>
                <View style={styles.inputContainer}>
                    <MaterialIcons
                                    name="alternate-email"
                                    size={30}
                                    color="#666"
                                    style={styles.icon}
                                />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        onChangeText={(email) => setEmail(email)}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name="ios-lock-closed-outline"
                        size={30}
                        color="#666"
                        style={styles.icon}
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
            </View>
            <TouchableOpacity
                onPress={() => loginUser(email, password)}
                style={styles.button}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={{ marginTop: 20 }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    Don't have an account? Sign Up Now
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    textInput: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 360,
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
    },
    inputContainer: {
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        left: 10,
        marginRight: 5
      }
});
