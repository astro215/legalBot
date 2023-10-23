import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function TxtFilePicker() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const navigation = useNavigation();

  const summarizeText = async () => {
    try {
      if (fileContent) {
        console.log("hi");
        const apiUrl = "https://astro21-bart-cls.hf.space/predict";
        
        const response = await axios.post(apiUrl, {}, { params: { text: fileContent } });

        if (response.status === 200) {
          const summarizedText = response.data.result;
          setFileContent(summarizedText);
          navigation.navigate('SummaryScreen', { summarizedText: summarizedText });
        } else {
          console.error('API request failed with status:', response.status);
        }
      } else {
        console.error('File content is empty.');
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
      });

      if (result != null) {
        // Handle file load success
      }

      if (!result.canceled) {
        setSelectedFile(result);
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          await loadFileContent(result.assets[0].uri);
        } else {
          console.error('File URI is null');
          setFileContent(null);
        }
      } else {
        setSelectedFile(null);
        setShowContent(false);
        console.log('User cancelled the picker');
      }
    } catch (error) {
      console.error('Error picking a document:', error);
    }
  };

  const loadFileContent = async (uri) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri);
      setFileContent(fileContent);
      setShowContent(true);
    } catch (error) {
      console.error('Error reading file content:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={30} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>
        {selectedFile ? (
          <View>
            <Text style={styles.fileName}>Selected File: {selectedFile.assets[0].name}</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => {
                setShowContent(!showContent);
              }}
            >
              <Text>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={summarizeText}>
              <Text style={styles.buttonText}>Summarize</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Text style={styles.buttonText}>Pick a .txt file</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={showContent}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.modalContentContainer}>
            <Text>{fileContent}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowContent(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallButton: {
    width: 100,
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContentContainer: {
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});
