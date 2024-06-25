import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Paho from 'paho-mqtt';

const Motor = ({ tankId }) => {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const reconnectTimeout = useRef(null);

  const connectClient = () => {
    const mqttClient = new Paho.Client(process.env.MQTT_BROKER, 8884, 'client-id');

    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        setConnectionStatus(`Connection lost: ${responseObject.errorMessage}`);
        console.error('Connection lost: ' + responseObject.errorMessage);
        reconnectTimeout.current = setTimeout(connectClient, 5000); // Attempt to reconnect after 5 seconds
      }
    };

    mqttClient.connect({
      useSSL: true,
      userName: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      onSuccess: () => {
        setClient(mqttClient);
        setConnectionStatus('Connected');
        mqttClient.subscribe(`tanks/${tankId}/togglepump`, {
          onSuccess: () => {
            console.log(`Subscribed to tanks/${tankId}/togglepump topic`);
          },
          onFailure: (error) => {
            setConnectionStatus(`Subscription failed: ${error.errorMessage}`);
            console.error('Subscription failed: ', error.errorMessage);
          }
        });
      },
      onFailure: (error) => {
        setConnectionStatus(`Connection failed: ${error.errorMessage}`);
        console.error('Connection failed: ', error.errorMessage);
        reconnectTimeout.current = setTimeout(connectClient, 5000); // Attempt to reconnect after 5 seconds
      }
    });
  };

  useEffect(() => {
    connectClient();

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [tankId]);

  const sendCommand = (command) => {
    if (client && client.isConnected()) {
      const message = new Paho.Message(command.toString());
      message.destinationName = `tanks/${tankId}/togglepump`;
      client.send(message);
      console.log('Sent command:', command);
    } else {
      console.error('MQTT client is not connected.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{connectionStatus}</Text>
      <Text style={styles.title}>Motor Control</Text>
      <Button style={styles.button} title="Turn On" onPress={() => sendCommand(0)} />
      <View style={styles.spacer}></View>
      <Button color="red" style={styles.button} title="Turn Off" onPress={() => sendCommand(1)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    margin: 10,
  },
  spacer: {
    height: 20,
  },
});

export default Motor;
