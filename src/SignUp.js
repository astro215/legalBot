import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { auth, db } from '../config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setfullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const signUpUser = async (email, password, fullName, phone) => {

    if (!email || !password || !fullName || !phone) {
        alert('Please fill in all required fields');
        return;
      }
      
    try {
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send email verification
      await sendEmailVerification(auth.currentUser, {
        handleCodeInApp: true,
        url: 'https://nlplegalbot.firebaseapp.com',
      });

      // Save user information to Firestore
      const userRef = collection(db, 'users');

      await setDoc(doc(userRef, userCredential.user.uid), {
        fullName,
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Ensure that taps outside of text inputs dismiss the keyboard
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={{ fontSize: 40, fontWeight: 'bold'}}>SignUp</Text>
            <View style={{ marginTop: 10 }}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={30}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Full Name"
                  onChangeText={(fullName) => setfullName(fullName)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputContainer}>
              <MaterialIcons
                  name="phone"
                  size={30}
                  color="#666"
                  style={styles.icon}
                />
              <TextInput
                  style={styles.textInput}
                  placeholder="Phone"
                  onChangeText={(phone) => setPhone(phone)}
                  autoCapitalize="none"
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => signUpUser(email, password, fullName , phone)} style={styles.button}>
              <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    paddingTop: 10,
    paddingBottom: 10,
    width: 360,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 50,
    height: 50,
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
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
