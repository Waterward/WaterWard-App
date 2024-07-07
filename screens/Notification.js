import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotification } from './NotificationContext';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    if (notifications.length > 0) {
      const timeout = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 5000); // Dismiss notification after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  return (
    <View style={styles.notificationContainer}>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={styles.notification}
          onPress={() => removeNotification(notification.id)}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  notification: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    color: 'white',
  },
});

export default Notification;
