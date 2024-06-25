import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import * as Paho from 'paho-mqtt';

const PH = ({ tankId }) => {
  const [PHlevel, setPHLevel] = useState('Loading...');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = new Paho.Client(process.env.MQTT_BROKER, 8884, 'client');

    mqttClient.onConnectionLost = (responseObject) => {
      console.error('Connection lost: ' + responseObject.errorMessage);
    };

    mqttClient.onMessageArrived = (message) => {
      const receivedPHLevel = message.payloadString;
      setPHLevel(receivedPHLevel);
    };

    mqttClient.connect({
      useSSL: true,
      userName: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        setClient(mqttClient);
        mqttClient.subscribe(`tanks/${tankId}/pH`, {
          onSuccess: () => {
            console.log(`Subscribed to tanks/${tankId}/pH topic`);
          },
          onFailure: (error) => {
            console.error('Subscription failed: LOL', error.errorMessage);
          }
        });
      },
      onFailure: (error) => {
        console.error('Connection failed: LOL', error.errorMessage);
      }
    });

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
    };
  }, [tankId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PH: {PHlevel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  text: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
export default PH;
