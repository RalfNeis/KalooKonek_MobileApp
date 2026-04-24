/// <reference types="nativewind/types" />
import { Stack, Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, QrCode } from 'lucide-react-native';

const Logo = () => (
  <View className="flex-row items-center gap-3">
    <View className="bg-red-600 p-2 rounded-xl items-center justify-center">
      <QrCode size={20} color="white" />
    </View>
    <View>
      <Text className="font-bold text-gray-900 text-lg leading-tight">KalooKonek</Text>
      <Text className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
        Caloocan Senior Citizen Portal
      </Text>
    </View>
  </View>
);

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerShadowVisible: false,
        headerTitle: () => <Logo />,
        headerRight: () => (
          <Link href="/settings" asChild>
            <TouchableOpacity className="bg-gray-50 p-2 rounded-full mr-2">
              <User size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: true, title: 'Dashboard' }} />
      <Stack.Screen name="health" options={{ title: 'Health Records', headerBackTitle: 'Back' }} />
      <Stack.Screen name="medicine" options={{ title: 'Medicine Cabinet', headerBackTitle: 'Back' }} />
      <Stack.Screen name="qrcode" options={{ title: 'Digital ID', headerBackTitle: 'Back' }} />
      <Stack.Screen name="appointments" options={{ title: 'Appointments', headerBackTitle: 'Back' }} />
      <Stack.Screen name="emergency" options={{ title: 'Emergency', headerBackTitle: 'Back' }} />
      <Stack.Screen name="settings" options={{ title: 'Account Settings', headerBackTitle: 'Back' }} />
      
      {/* New Detail Screens */}
      <Stack.Screen name="announcement" options={{ title: 'Announcement', headerBackTitle: 'Back' }} />
      <Stack.Screen name="checkup-details" options={{ title: 'Checkup Details', headerBackTitle: 'Back' }} />
      <Stack.Screen name="refill" options={{ title: 'Request Refill', headerBackTitle: 'Back' }} />

      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}