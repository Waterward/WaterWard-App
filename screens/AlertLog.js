import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const fakeAlerts = [
  { id: '1', type: 'empty', value: '10', time: '2023-07-01 10:00:00', details: 'Tank is empty.' },
  { id: '2', type: 'filling', value: '20', time: '2023-07-02 11:00:00', details: 'Tank is filling up.' },
  { id: '3', type: 'full', value: '30', time: '2023-07-03 12:00:00', details: 'Tank is full.' },
  { id: '4', type: 'draining', value: '15', time: '2023-10-10 13:00:00', details: 'Tank is draining.' },
  { id: '5', type: 'leaking', value: '5', time: '2023-02-12 14:00:00', details: 'Tank is leaking.' },
  { id: '6', type: 'flooding', value: '50', time: '2024-5-06 15:00:00', details: 'Tank is flooding.' }
];

const alertIcons = {
  empty: 'alert-circle-outline',
  filling: 'water-outline',
  full: { name: 'water-check', iconSet: MaterialCommunityIcons },
  draining: { name: 'water-minus', iconSet: MaterialCommunityIcons },
  leaking: { name: 'pipe-leak', iconSet: MaterialCommunityIcons },
  flooding: { name: 'flood', iconSet: MaterialIcons }
};

const renderAlertIcon = (type) => {
  const IconComponent = alertIcons[type].iconSet || Ionicons;
  const iconName = alertIcons[type].name || alertIcons[type];
  return <IconComponent name={iconName} size={32} color="black" />;
};

const AlertLog = () => {
  const [alerts, setAlerts] = useState(fakeAlerts);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAlert(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.alertItem} onPress={() => openModal(item)}>
      <View style={styles.iconContainer}>
        {renderAlertIcon(item.type)}
      </View>
      <View style={styles.alertDetails}>
        <Text style={styles.alertType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Alert</Text>
        <Text>Value: {item.value}</Text>
        <Text>Time: {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alert Log</Text>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.alertList}
      />

      {selectedAlert && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{selectedAlert.type.charAt(0).toUpperCase() + selectedAlert.type.slice(1)} Alert</Text>
              {renderAlertIcon(selectedAlert.type)}
              <Text style={styles.modalText}>Value: {selectedAlert.value}</Text>
              <Text style={styles.modalText}>Time: {selectedAlert.time}</Text>
              <Text style={styles.modalText}>Details: {selectedAlert.details}</Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  alertList: {
    paddingBottom: 20
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9'
  },
  iconContainer: {
    marginRight: 15
  },
  alertDetails: {
    flex: 1
  },
  alertType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default AlertLog;
