import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Paho from 'paho-mqtt';

const deviceId = 'esp32'; // The ID of your device

const MQTT = () => {
  const [client, setClient] = useState(null);
  const [tankId, setTankId] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const reconnectTimeout = useRef(null);

  const connectClient = () => {
    const mqttClient = new Paho.Client(process.env.MQTT_BROKER, 8884, deviceId);
    
    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        setConnectionStatus(`Connection lost: ${responseObject.errorMessage}`);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      setMessages((prevMessages) => [...prevMessages, message.payloadString]);
    };

    mqttClient.connect({
      useSSL: true,
      userName: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      onSuccess: () => {
        setClient(mqttClient);
        setConnectionStatus('Connected');
        mqttClient.subscribe(`devices/${deviceId}/commands`, {
          onSuccess: () => {
            console.log('Subscribed to commands topic');
          },
          onFailure: (error) => {
            setConnectionStatus(`Subscription failed: ${error.errorMessage}`);
          }
        });
      },
      onFailure: (error) => {
        setConnectionStatus(`Connection failed: ${error.errorMessage}`);
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
  }, []);

  const sendCommandMessage = (command) => {
    if (client && client.isConnected()) {
      const message = new Paho.Message(JSON.stringify({ command, tankId }));
      message.destinationName = `devices/${deviceId}/commands`;
      client.send(message);
    } else {
      console.error('MQTT client is not connected');
    }
  };

  const handleAttachTank = () => {
    sendCommandMessage('attach');
  };

  const handleDetachTank = () => {
    sendCommandMessage('detach');
  };

  const handleReconnect = () => {
    if (client && client.isConnected()) {
      client.disconnect();
    }
    connectClient();
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.status}>{connectionStatus}</Text>
      <TouchableOpacity style={styles.reconnectButton} onPress={handleReconnect}>
        <Text style={styles.reconnectButtonText}>Reconnect</Text>
      </TouchableOpacity>
      <Button title="Clear Messages" onPress={handleClearMessages} />
      {messages.map((message, index) => (
        <View key={index} style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      ))}
      <Text style={styles.label}>Tank ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tank ID"
        value={tankId}
        onChangeText={setTankId}
      />
      <View style={styles.buttonContainer}>
        <Button title="Attach Tank" onPress={handleAttachTank} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Detach Tank" onPress={handleDetachTank} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  messageContainer: {
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: 16,
  },
  reconnectButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  reconnectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default MQTT;
