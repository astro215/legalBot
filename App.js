import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { auth } from "./config"; // Updated import
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Login from "./src/Login";
import SignUp from "./src/SignUp";
import Profile from "./src/Profile";
import Header from "./src/components/Header";
import TxtFilePicker from "./src/TxtFilePicker";
import SummaryScreen from "./src/SummaryScreen"; // Replace with the actual path to SummaryScreen


const Stack = createStackNavigator();


const ProfileIcon = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 10 }}>
    <Ionicons name="person-circle" size={50 } color="grey" />
  </TouchableOpacity>
);


function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged); // Use the updated auth
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: () => <Header name="Login " />,
            headerStyle: {
              height: 80,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: "#00e4d1",
              shadowColor: "#000",
              elevation: 25,
            },
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerTitle: () => <Header name="SignUp " />,
            headerStyle: {
              height: 80,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: "#00e4d1",
              shadowColor: "#000",
              elevation: 25,
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
        <Stack.Screen
        name="TxtFilePicker"
        component={TxtFilePicker} // Start with "TxtFilePicker" as the home screen
        options={({ navigation }) => ({
        headerTitle: () => <Header name="Legal Buddy" />,
          headerStyle: {
            height: 80,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: "#00e4d1",
            shadowColor: "#000",
            elevation: 25,
          },
          headerRight: () => <ProfileIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: () => <Header name="Profile" />,
          headerStyle: {
            height: 80,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: "#00e4d1",
            shadowColor: "#000",
            elevation: 25,
          },
        }}
      />
      <Stack.Screen
        name="SummaryScreen"
        component={SummaryScreen}
        options={({ route }) => ({
        headerTitle: () => <Header name="Summary" />, // Customize the header as needed
        headerStyle: {
          height: 80,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: "#00e4d1",
          shadowColor: "#000",
          elevation: 25,
        },
        // Other options if necessary
        })}
        />   
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}
