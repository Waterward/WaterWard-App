import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Paho from 'paho-mqtt';

const Temperature = ({ tankId }) => {
  const [TempLevel, setTempLevel] = useState('Loading...');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = new Paho.Client(process.env.MQTT_BROKER, 8884, 'client-id');

    mqttClient.onConnectionLost = (responseObject) => {
      console.error('Connection lost: ' + responseObject.errorMessage);
    };

    mqttClient.onMessageArrived = (message) => {
      const receivedTempLevel = message.payloadString;
      setTempLevel(receivedTempLevel);
    };

    mqttClient.connect({
      useSSL: true,
      userName: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        setClient(mqttClient);
        mqttClient.subscribe(`tanks/${tankId}/temperature`, {
          onSuccess: () => {
            console.log(`Subscribed to tanks/${tankId}/temperature topic`);
          },
          onFailure: (error) => {
            console.error('Subscription failed: ', error.errorMessage);
          }
        });
      },
      onFailure: (error) => {
        console.error('Connection failed: ', error.errorMessage);
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
      <Text style={styles.text}>Temperature: {TempLevel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  text: {
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "bold"
  }
});

export default Temperature;
