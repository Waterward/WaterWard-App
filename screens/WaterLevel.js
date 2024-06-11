import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {FIREBASE_FIRESTORE} from '../firebaseConfig'

const WaterLevel = ({ tankId }) => {
  const [tankConfig, setTankConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTankConfig = async () => {
      console.log("Tank ID = "+ tankId)
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

  const calculateWaterVolume = () => {
    if (!tankConfig) return null;
    const { height, diameter, currentWaterHeight } = tankConfig;
    const radius = diameter / 2;
    const volume = Math.PI * Math.pow(radius, 2) * currentWaterHeight * 1000; // Convert cubic meters to liters
    return volume;
  };

  const calculateWaterHeightPercentage = () => {
    if (!tankConfig) return null;
    const { height, currentWaterHeight } = tankConfig;
    const percentage = (currentWaterHeight / height) * 100;
    return percentage;
  };

  const calculateEstimatedDaysUntilEmpty = () => {
    if (!tankConfig) return null;
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
