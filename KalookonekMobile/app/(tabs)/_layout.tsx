/// <reference types="nativewind/types" />
import { Tabs } from 'expo-router';
import { Home, Megaphone } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, // This hides the duplicate inner header!
      tabBarActiveTintColor: '#DC2626', // Red color for KalooKonek theme
      tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold' }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: 'Announcements',
          tabBarIcon: ({ color }) => <Megaphone size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}