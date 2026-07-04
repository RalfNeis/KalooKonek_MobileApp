import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import { NumericKeypad } from '../../components/NumericKeypad';
import { ShieldCheck } from 'lucide-react-native';
import { apiClient } from '../../api/client';
import * as SecureStore from 'expo-secure-store';

export default function PinSetupScreen() {
  const [step, setStep] = useState(1); // 1 = enter pin, 2 = confirm pin
  const [firstPin, setFirstPin] = useState('');
  const [secondPin, setSecondPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKeyPress = (key: string) => {
    if (isLoading) return;
    
    if (step === 1) {
      if (firstPin.length < 6) {
        const newPin = firstPin + key;
        setFirstPin(newPin);
        if (newPin.length === 6) {
          setTimeout(() => setStep(2), 200);
        }
      }
    } else {
      if (secondPin.length < 6) {
        const newPin = secondPin + key;
        setSecondPin(newPin);
        if (newPin.length === 6) {
          verifyAndSave(newPin);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isLoading) return;
    
    if (step === 1 && firstPin.length > 0) {
      setFirstPin(firstPin.slice(0, -1));
    } else if (step === 2 && secondPin.length > 0) {
      setSecondPin(secondPin.slice(0, -1));
    }
  };

  const verifyAndSave = async (confirmPin: string) => {
    if (firstPin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      setFirstPin('');
      setSecondPin('');
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('accounts/settings/setup-pin/', { pin: firstPin });
      
      if (response.status === 200) {
        await SecureStore.setItemAsync('pin_enabled', 'true');
        Alert.alert('Success', 'Quick Login PIN has been set up successfully.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to setup PIN. Please try again.');
      setFirstPin('');
      setSecondPin('');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPin = step === 1 ? firstPin : secondPin;

  return (
    <View className="flex-1 bg-white items-center justify-center pt-20">
      <View className="items-center mb-12">
        <View className="bg-red-50 p-4 rounded-full mb-6">
          <ShieldCheck size={48} color="#DC2626" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 ? 'Setup Quick PIN' : 'Confirm PIN'}
        </Text>
        <Text className="text-gray-500 text-center px-8">
          {step === 1 
            ? 'Create a 6-digit PIN for faster and easier login.' 
            : 'Please re-enter your PIN to confirm.'}
        </Text>
      </View>

      <View className="flex-row justify-center gap-4 mb-16">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View 
            key={index} 
            className={`w-6 h-6 rounded-full border-2 ${
              currentPin.length > index ? 'bg-red-600 border-red-600' : 'bg-gray-100 border-gray-200'
            }`} 
          />
        ))}
      </View>

      <NumericKeypad 
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        showBiometric={false}
      />
    </View>
  );
}
