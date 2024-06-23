import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../firebaseConfig';
import * as Paho from 'paho-mqtt';

const WaterLevel = ({ tankId }) => {
  const [tankConfig, setTankConfig] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchTankConfig = async () => {
      try {
        const tankDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'tanks', tankId));
        if (tankDoc.exists()) {
          setTankConfig(tankDoc.data());
        } else {
          setError('Tank configuration not found.');
        }
      } catch (err) {
        setError('Failed to fetch tank configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchTankConfig();
  }, [tankId]);

  useEffect(() => {
    const mqttClient = new Paho.Client(process.env.MQTT_BROKER, 8884, 'clientId');
    
    mqttClient.onConnectionLost = (responseObject) => {
      console.error('Connection lost: ' + responseObject.errorMessage);
    };

    mqttClient.onMessageArrived = (message) => {
      const receivedWaterLevel = parseFloat(message.payloadString);
      setWaterLevel(receivedWaterLevel);
    };

    mqttClient.connect({
      useSSL: true,
      userName: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
      onSuccess: () => {
        setClient(mqttClient);
        mqttClient.subscribe(`tanks/${tankId}/waterLevel`, {
          onSuccess: () => {
            console.log(`Subscribed to tanks/${tankId}/waterLevel topic`);
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

const calculateWaterVolume = () => {
  if (!tankConfig || waterLevel === null) return null;
  const { type, length, diameter, width, height } = tankConfig;

  let volume = 0;
  const radius = diameter / 2;
  const effectiveHeight = height - waterLevel; // Correct height based on ultrasonic reading

  switch (type) {
    case 'Rectangle':
      volume = length * width * effectiveHeight * 0.001; // Convert cm³ to liters
      break;
    case 'Vertical Cylinder':
      volume = Math.PI * Math.pow(radius, 2) * effectiveHeight * 0.001; // Convert cm³ to liters
      break;
    case 'Horizontal Cylinder':
      const theta = 2 * Math.acos((radius - effectiveHeight) / radius);
      const segmentArea = (Math.pow(radius, 2) / 2) * (theta - Math.sin(theta));
      if (effectiveHeight <= radius) {
        volume = segmentArea * length * 0.001; // Convert cm³ to liters
      } else {
        const totalVolume = Math.PI * Math.pow(radius, 2) * length * 0.001; // Convert cm³ to liters
        volume = totalVolume - (segmentArea * length * 0.001);
      }
      break;
    default:
      volume = null;
      break;
  }

  return volume;
};

  const calculateWaterHeightPercentage = () => {
    if (!tankConfig || waterLevel === null) return null;
    const { height } = tankConfig;
    const percentage = ((height - waterLevel) / height) * 100; // Correct percentage based on ultrasonic reading
    return percentage;
  };

  const calculateEstimatedDaysUntilEmpty = () => {
    if (!tankConfig || waterLevel === null) return null;
    const { dailyUsage } = tankConfig;
    const volume = calculateWaterVolume();
    if (dailyUsage && volume) {
      return volume / dailyUsage;
    }
    return null;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const waterVolume = calculateWaterVolume();
  const waterHeightPercentage = calculateWaterHeightPercentage();
  const estimatedDaysUntilEmpty = calculateEstimatedDaysUntilEmpty();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tankConfig.name}</Text>
      <Text style={styles.label}>Water Volume: {waterVolume ? `${waterVolume.toFixed(2)} liters` : 'N/A'}</Text>
      <Text style={styles.label}>Water Height: {waterHeightPercentage ? `${waterHeightPercentage.toFixed(2)}%` : 'N/A'}</Text>
      <Text style={styles.label}>Estimated Days Until Empty: {estimatedDaysUntilEmpty ? `${estimatedDaysUntilEmpty.toFixed(2)} days` : 'N/A'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default WaterLevel;
