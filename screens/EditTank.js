import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../firebaseConfig';

const EditTank = ({ route, navigation }) => {
  const { tankId } = route.params;
  const [tank, setTank] = useState(null);

  useEffect(() => {
    const fetchTank = async () => {
      const tankRef = doc(FIREBASE_FIRESTORE, 'tanks', tankId);
      const tankSnap = await getDoc(tankRef);
      if (tankSnap.exists()) {
        setTank(tankSnap.data());
      }
    };
    fetchTank();
  }, [tankId]);

  const handleSave = async () => {
    const tankRef = doc(FIREBASE_FIRESTORE, 'tanks', tankId);
    await updateDoc(tankRef, tank);
    navigation.goBack();
  };

  if (!tank) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={tank.name}
        onChangeText={(text) => setTank({ ...tank, name: text })}
      />
      <Text style={styles.label}>Type</Text>
      <TextInput
        style={styles.input}
        value={tank.type}
        onChangeText={(text) => setTank({ ...tank, type: text })}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditTank;
