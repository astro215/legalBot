import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SummaryScreen({ route }) {
  const { summarizedText } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.modalContentContainer}>
        <Text style={styles.summarizedText}>{summarizedText}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcc9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  summarizedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
