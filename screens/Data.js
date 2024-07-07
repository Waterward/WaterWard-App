import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const fakeHistoricalData = {
  waterLevel: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Water Level']
  },
  ph: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [7.0, 7.1, 7.2, 7.3, 7.4, 7.5],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['PH Level']
  },
  temperature: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [15, 16, 17, 18, 19, 20],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Temperature']
  },
  tds: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [300, 310, 320, 330, 340, 350],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['TDS (Total Dissolved Solids)']
  },
  turbidity: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5, 10, 15, 20, 25, 30],
        color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Turbidity']
  },
  waterFlow: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60],
        color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Water Flow']
  },
  predictions: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [50, 52, 59, 68, 71, 73],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [52, 56, 61, 71, 69, 76],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Predicted', 'Actual']
  }
};

const UsageData = {
  lastWeek: 560, // in liters
  lastMonth: 2000, // in liters
  average: 112 // in liters per day
};

const Data = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.usageContainer}>
        <Text style={styles.usageTitle}>Water Usage</Text>
        <View style={styles.usageItem}>
          <Text style={styles.usageLabel}>Last Week:</Text>
          <Text style={styles.usageValue}>{UsageData.lastWeek} liters</Text>
        </View>
        <View style={styles.usageItem}>
          <Text style={styles.usageLabel}>Last Month:</Text>
          <Text style={styles.usageValue}>{UsageData.lastMonth} liters</Text>
        </View>
        <View style={styles.usageItem}>
          <Text style={styles.usageLabel}>Average:</Text>
          <Text style={styles.usageValue}>{UsageData.average} liters/day</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Water Usage AI Predictions</Text>
        <LineChart
          data={fakeHistoricalData.predictions}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Water Level Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.waterLevel}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>PH Level Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.ph}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Temperature Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.temperature}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>TDS Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.tds}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Turbidity Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.turbidity}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Water Flow Historical Data</Text>
        <LineChart
          data={fakeHistoricalData.waterFlow}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  usageContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  usageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  usageLabel: {
    fontSize: 16,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});

export default Data;
