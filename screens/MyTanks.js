import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, Modal, TextInput, Button, ScrollView } from 'react-native';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const tankImages = {
  'Rectangle': require('../assets/images/tank_003.jpg'),
  'Vertical Cylinder': require('../assets/images/VerticalCylinderTank.png'),
  'Horizontal Cylinder': require('../assets/images/HorizontalCylinderTank.png'),
};

const MyTanks = ({ user }) => {
  const [tanks, setTanks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTankData, setEditTankData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(FIREBASE_FIRESTORE, 'tanks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tankData = [];
      querySnapshot.forEach((doc) => {
        tankData.push({ ...doc.data(), id: doc.id });
      });
      const userTanks = tankData.filter(tank => tank.userId === user.uid);
      setTanks(userTanks);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleDeleteTank = async (tankId) => {
    console.log("Deleting tank with ID: ", tankId);
    try {
      const tankRef = doc(FIREBASE_FIRESTORE, 'tanks', tankId);
      await deleteDoc(tankRef);
      Alert.alert('Success', 'Tank deleted successfully');
    } catch (error) {
      console.error('Error deleting tank: ', error);
      Alert.alert('Error', 'Failed to delete tank');
    }
  };

  const handleEditTank = async (tankId) => {
    const tankRef = doc(FIREBASE_FIRESTORE, 'tanks', tankId);
    const tankSnap = await getDoc(tankRef);
    if (tankSnap.exists()) {
      setEditTankData({ ...tankSnap.data(), id: tankSnap.id });
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = async () => {
    const { id, ...updatedData } = editTankData;
    const tankRef = doc(FIREBASE_FIRESTORE, 'tanks', id);
    await updateDoc(tankRef, updatedData);
    setEditModalVisible(false);
    Alert.alert('Success', 'Tank updated successfully');
  };

  const handleTypeSelection = (selectedType) => {
    setEditTankData({ ...editTankData, type: selectedType });
  };

  const renderTank = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardContent} 
        onPress={() => navigation.navigate('Sensors', { tankId: item.id })}
      >
        <Image source={tankImages[item.type]} style={styles.tankImage} />
        <View style={styles.tankInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>Type: {item.type}</Text>
          <Text>Height: {item.height}</Text>
          <Text>Width: {item.width}</Text>
          <Text>Diameter: {item.diameter}</Text>
          <Text>Length: {item.length}</Text>
          <Text>Full Depth: {item.fullDepth}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleEditTank(item.id)}>
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTank(item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {tanks.length === 0 ? (
        <View style={styles.noTanksContainer}>
          <Text style={styles.noTanksText}>No tanks found.</Text>
          <Button title="Add Tank" onPress={() => navigation.navigate('Add Tank')} /> 
        </View>
      ) : (
        <FlatList
          data={tanks}
          renderItem={renderTank}
          keyExtractor={item => item.id}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Tank</Text>
            {editTankData && (
              <>
                <Text style={styles.label}>Change Tank Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tank Name"
                  value={editTankData.name}
                  onChangeText={(text) => setEditTankData({ ...editTankData, name: text })}
                />

                <Text style={styles.label}>Select Tank Type:</Text>
                <View style={styles.typeSelectionContainer}>
                  <TouchableOpacity onPress={() => handleTypeSelection('Rectangle')} style={styles.typeOption}>
                    <Image source={require('../assets/images/tank_003.jpg')} style={styles.typeImage} />
                    <Text style={styles.typeText}>Rectangle | </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTypeSelection('Vertical Cylinder')} style={styles.typeOption}>
                    <Image source={require('../assets/images/VerticalCylinderTank.png')} style={styles.typeImage} />
                    <Text style={styles.typeText}>Vertical Cylinde | </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTypeSelection('Horizontal Cylinder')} style={styles.typeOption}>
                    <Image source={require('../assets/images/HorizontalCylinderTank.png')} style={styles.typeImage} />
                    <Text style={styles.typeText}>Horizontal Cylinder </Text>
                  </TouchableOpacity>
                </View>

                {editTankData.type === 'Rectangle' && (
                  <>
                    <Text style={styles.label}>Height:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Height"
                      value={editTankData.height ? editTankData.height.toString() : ''}
                      onChangeText={(text) => setEditTankData({ ...editTankData, height: text })}
                      keyboardType="numeric"
                    />
                    <Text style={styles.label}>Width:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Width"
                      value={editTankData.width ? editTankData.width.toString() : ''}
                      onChangeText={(text) => setEditTankData({ ...editTankData, width: text })}
                      keyboardType="numeric"
                    />
                    <Text style={styles.label}>Length:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Length"
                      value={editTankData.length ? editTankData.length.toString() : ''}
                      onChangeText={(text) => setEditTankData({ ...editTankData, length: text })}
                      keyboardType="numeric"
                    />
                  </>
                )}

                {(editTankData.type === 'Vertical Cylinder' || editTankData.type === 'Horizontal Cylinder') && (
                  <>
                    <Text style={styles.label}>Height:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Height"
                      value={editTankData.height ? editTankData.height.toString() : ''}
                      onChangeText={(text) => setEditTankData({ ...editTankData, height: text })}
                      keyboardType="numeric"
                    />
                    <Text style={styles.label}>Diameter:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Diameter"
                      value={editTankData.diameter ? editTankData.diameter.toString() : ''}
                      onChangeText={(text) => setEditTankData({ ...editTankData, diameter: text })}
                      keyboardType="numeric"
                    />
                  </>
                )}

                <Text style={styles.label}>Full Depth (Optional):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Depth"
                  value={editTankData.fullDepth ? editTankData.fullDepth.toString() : ''}
                  onChangeText={(text) => setEditTankData({ ...editTankData, fullDepth: text })}
                  keyboardType="numeric"
                />

                <Button title="Save" onPress={handleSaveEdit} />
                <View style={{padding:10}}></View>
                <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
              </>
            )}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
  },
  tankImage: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  tankInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  noTanksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTanksText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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
    width: '100%',
  },
  typeSelectionContainer: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginVertical: 20,
  },
  typeOption: {
    justifyContent:'space-evenly',
    alignItems: 'center',
  },
  typeImage: {
    width: 70,
    height: 70,
  },
  typeText: {
    justifyContent:'space-evenly',
    marginTop: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MyTanks;
