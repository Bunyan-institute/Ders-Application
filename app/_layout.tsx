import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLearningStore, useDownloadStore, useSettingsStore } from '../src/store';
import { Colors } from '../src/theme';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadLearning = useLearningStore(s => s.loadData);
  const loadDownloads = useDownloadStore(s => s.loadDownloads);
  const loadSettings = useSettingsStore(s => s.loadSettings);
  const theme = useSettingsStore(s => s.theme);

  useEffect(() => {
    Promise.all([loadLearning(), loadDownloads(), loadSettings()]).then(() => setReady(true));
  }, []);

  const isDarkMode = theme === 'dark';
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  if (!ready) {
    return (
      <View style={[styles.loader, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: currentColors.background },
        }}
        initialRouteName="index"
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: 'none' }} />
        <Stack.Screen
          name="category/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Category',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: currentColors.surface },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="course/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Course',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: currentColors.surface },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Lesson',
            headerBackTitle: 'Back',
            presentation: 'fullScreenModal',
            animation: 'none',
            headerStyle: { backgroundColor: currentColors.surface },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: true,
            headerTitle: 'About Bunyan',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: currentColors.surface },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="admin/index"
          options={{
            headerShown: true,
            headerTitle: 'Admin Analytics',
            headerBackTitle: 'Settings',
            headerStyle: { backgroundColor: currentColors.surface },
            headerTintColor: currentColors.text,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
