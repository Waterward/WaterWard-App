import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { getFirestore, collection, addDoc, doc,serverTimestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AlertConfiguration from './AlertConfiguration'; // Ensure to import your AlertConfiguration component
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

const firestore = getFirestore(app);

const AddTank = ({ user }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [fullDepth, setFullDepth] = useState('');
  const [alerts, setAlerts] = useState({});
  const navigation = useNavigation();

  const handleAddTank = async () => {
    // const tankId = Math.floor(Math.random(10));
    const newTank = {
      // id: tankId,
      userId: user.uid,
      name,
      type,
      height: height ? parseFloat(height) : null,
      width: width ? parseFloat(width) : null,
      diameter: diameter ? parseFloat(diameter) : null,
      length: length ? parseFloat(length) : null,
      fullDepth: fullDepth ? parseFloat(fullDepth) : null,
      createdAt: serverTimestamp(),
    };

    try {
      const tankRef = await addDoc(collection(firestore, 'tanks'), newTank);

      // Add alerts as subcollection
      const alertsRef = collection(tankRef, 'alerts');
      await Promise.all(Object.entries(alerts).map(([key, value]) =>
        addDoc(alertsRef, { type: key, value })
      ));

      Alert.alert('Success', 'Tank added successfully');
      navigation.navigate('My Tanks');
    } catch (error) {
      console.error('Error adding tank: ', error);
      Alert.alert('Failed to add tank');
    }
  };

  const handleTypeSelection = (selectedType) => {
    setType(selectedType);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tank Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tank Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Select Tank Type:</Text>
      <View style={styles.typeSelectionContainer}>
        <TouchableOpacity onPress={() => handleTypeSelection('Rectangle')} style={styles.typeOption}>
          <Image source={{ uri: 'https://www.calculatorsoup.com/images/tank_rect_003.jpg' }} style={styles.typeImage} />
          <Text style={styles.typeText}>Rectangle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTypeSelection('Vertical Cylinder')} style={styles.typeOption}>
          <Image source={{ uri: 'https://www.calculatorsoup.com/images/tank_cyl_v_003.jpg' }} style={styles.typeImage} />
          <Text style={styles.typeText}>Vertical Cylinder</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTypeSelection('Horizontal Cylinder')} style={styles.typeOption}>
          <Image source={{ uri: 'https://www.calculatorsoup.com/images/tank_cyl_h_003.jpg' }} style={styles.typeImage} />
          <Text style={styles.typeText}>Horizontal Cylinder</Text>
        </TouchableOpacity>
      </View>

      {type === 'Rectangle' && (
        <>
          <Text style={styles.label}>Height:</Text>
          <TextInput
            style={styles.input}
            placeholder="Height in cm "
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Width:</Text>
          <TextInput
            style={styles.input}
            placeholder="Width in cm"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Length:</Text>
          <TextInput
            style={styles.input}
            placeholder="Length in cm "
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
      <Text style={styles.label}>Full Depth (Optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Depth"
        value={fullDepth}
        onChangeText={setFullDepth}
        keyboardType="numeric"
      />
        </>

      )}

      {(type === 'Vertical Cylinder') && (
        <>
          <Text style={styles.label}>Height:</Text>
          <TextInput
            style={styles.input}
            placeholder="Height in cm"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Diameter:</Text>
          <TextInput
            style={styles.input}
            placeholder="Diameter in cm "
            value={diameter}
            onChangeText={setDiameter}
            keyboardType="numeric"
          />
      <Text style={styles.label}>Full Depth (Optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Depth"
        value={fullDepth}
        onChangeText={setFullDepth}
        keyboardType="numeric"
      />
        </>
      )}

       {(type === 'Horizontal Cylinder') && (
        <>
          <Text style={styles.label}>Length:</Text>
          <TextInput
            style={styles.input}
            placeholder="length in cm"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Diameter:</Text>
          <TextInput
            style={styles.input}
            placeholder="Diameter in cm "
            value={diameter}
            onChangeText={setDiameter}
            keyboardType="numeric"
          />
      <Text style={styles.label}>Full Depth (Optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Depth"
        value={fullDepth}
        onChangeText={setFullDepth}
        keyboardType="numeric"
      />
        </>
      )}

      <AlertConfiguration initialAlerts={alerts} onAlertsChange={setAlerts} />

      <Button title="Add Tank" onPress={handleAddTank} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  typeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  typeOption: {
    alignItems: 'center',
  },
  typeImage: {
    width: 100,
    height: 100,
  },
  typeText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AddTank;

