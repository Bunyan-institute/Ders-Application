import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '../../src/theme';
import { useSettingsStore } from '../../src/store';
import { useTranslation } from '../../src/hooks';

export default function TabLayout() {
  const systemScheme = useColorScheme();
  const themePref = useSettingsStore(s => s.theme);
  const isDark = themePref === 'system' ? systemScheme === 'dark' : themePref === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderLight,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 56,
          paddingBottom: 6,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t.tabs.search,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: t.tabs.downloads,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cloud-download' : 'cloud-download-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: t.tabs.bookmarks,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabs.settings,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={21} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
