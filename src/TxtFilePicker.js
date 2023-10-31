import React, { useState } from 'react';
import { View, Text, SafeAreaView,TouchableOpacity,TextInput, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function TxtFilePicker() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [inputText, setInputText] = useState(''); // State for text input


  const navigation = useNavigation();

  const summarizeText = async () => {
    try {
      if (inputText.length != 0 ) {
        console.log(inputText.length)
        setFileContent(inputText);
      }
      if (fileContent) {
        console.log("hi");
        console.log(fileContent);
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
        <TextInput
          style={styles.textInput}
          editable
          multiline={true}
          numberOfLines={25 }
          maxLength={40}
          placeholder="Enter text here                                                       "
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: 'bold'}}>OR</Text>

        
        
        <TouchableOpacity style={styles.pbutton} onPress={pickDocument}>
          <Text style={styles.buttonText}>Pick a .txt file</Text>
        </TouchableOpacity>

        {selectedFile ? (
          <View>
            <Text style={styles.fileName}> {selectedFile.assets[0].name}</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => {
                setShowContent(!showContent);
              }}
            >
              <Text style = {styles.ssname}>View</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        <TouchableOpacity style={styles.button} onPress={summarizeText}>
          <Text style={[ styles.sbuttonText]}>Summarize</Text>
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
            <Text style = {styles.ssname}>Close</Text>
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
    width: '50',  
    backgroundColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallButton: {
    width: 100,
    alignItems: 'center',
    backgroundColor: '#6FCB9F',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    width: 150,
    backgroundColor: '#FF5733',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    margin: 15,
  },
  pbutton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    margin: 15,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  ssname: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  sbuttonText: {
    fontSize: 20,
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
  textInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 40,
    marginTop: 10,
  },
  // textInput: {
  //   width: '90%',
  //   height: '60%',
  //   borderRadius: 10,
  //   borderColor: '#3a86ff',
  //   borderWidth: 1,
    
  //   backgroundColor: 'white',
  //   padding: 20,
  //   shadowColor: '#3a86ff'
  // },
});
