import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Sensors from './screens/Sensors';
import Mqtt from './screens/Mqtt';
import Data from './screens/Data';
import AddTank from './screens/AddTank';
import MyTanks from './screens/MyTanks';
import withUser from './withUser';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import Auth from './screens/Auth';
import AlertLog from './screens/AlertLog';
import { LogBox } from 'react-native';

// Ignore all log notifications
LogBox.ignoreAllLogs();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SensorsWithUser = withUser(Sensors);
const MqttWithUser = withUser(Mqtt);
const DataWithUser = withUser(Data);
const AddTankWithUser = withUser(AddTank);
const MyTanksWithUser = withUser(MyTanks);
const AlertLogWithUser = withUser(AlertLog);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'MQTT') {
          iconName = focused ? 'wifi' : 'wifi-outline';
        } else if (route.name === 'Analytics') {
          iconName = focused ? 'analytics' : 'analytics-outline';
        } else if (route.name === 'Add Tank') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'My Tanks') {
          iconName = focused ? 'water' : 'water-outline';
        } else if (route.name === 'Alert Log') {
          iconName = focused ? 'alert' : 'alert-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarActiveTintColor: 'deepskyblue',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="My Tanks" component={MyTanksWithUser} />
    <Tab.Screen name="MQTT" component={MqttWithUser} />
    <Tab.Screen name="Analytics" component={DataWithUser} />
    <Tab.Screen name="Add Tank" component={AddTankWithUser} />
    <Tab.Screen name="Alert Log" component={AlertLogWithUser} />
  </Tab.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return null; // Optionally show a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />

            <Stack.Screen name="Sensors" component={SensorsWithUser} options={{ headerShown: false }} />

            <Stack.Screen name="AddTank" component={AddTankWithUser} />

            <Stack.Screen name='"Alert Log' component={AlertLog} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
