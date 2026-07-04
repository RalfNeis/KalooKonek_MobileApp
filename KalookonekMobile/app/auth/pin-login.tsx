import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import { NumericKeypad } from '../../components/NumericKeypad';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Lock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function PinLoginScreen() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const bioEnabled = await SecureStore.getItemAsync('biometrics_enabled');
    if (bioEnabled === 'true') {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock KalooKonek',
          fallbackLabel: 'Use PIN',
          disableDeviceFallback: true,
        });

        if (result.success) {
          handleSuccessfulUnlock();
        }
      }
    }
  };

  const handleSuccessfulUnlock = () => {
    // If we're here, Supabase already has a valid session from AsyncStorage
    // We just need to route them to the dashboard
    router.replace('/(tabs)');
  };

  const handleKeyPress = (key: string) => {
    if (pin.length < 6 && !isLoading) {
      const newPin = pin + key;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isLoading) {
      setPin(pin.slice(0, -1));
    }
  };

  const verifyPin = async (pinToVerify: string) => {
    setIsLoading(true);
    try {
      // In a real app, we'd hit the backend verify-pin endpoint here.
      // But wait! If Supabase session is already alive, we just need to verify the pin against backend
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      if (!userEmail) {
        // Fallback if no session
        await supabase.auth.signOut();
        router.replace('/login');
        return;
      }

      // We should use the same base URL as apiClient
      // But since we might be locked out, let's just use fetch
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/';
      
      const response = await fetch(`${baseUrl}accounts/auth/verify-pin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, pin: pinToVerify })
      });

      if (response.ok) {
        handleSuccessfulUnlock();
      } else {
        const errData = await response.json();
        Alert.alert('Error', errData.error || 'Invalid PIN.');
        setPin('');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center pt-20">
      <View className="items-center mb-12">
        <View className="bg-red-50 p-4 rounded-full mb-6">
          <Lock size={48} color="#DC2626" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-gray-500 text-center px-8">
          Enter your 6-digit PIN to unlock KalooKonek
        </Text>
      </View>

      <View className="flex-row justify-center gap-4 mb-16">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View 
            key={index} 
            className={`w-6 h-6 rounded-full border-2 ${
              pin.length > index ? 'bg-red-600 border-red-600' : 'bg-gray-100 border-gray-200'
            }`} 
          />
        ))}
      </View>

      <NumericKeypad 
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        onBiometricPress={checkBiometrics}
        showBiometric={true}
      />
    </View>
  );
}
