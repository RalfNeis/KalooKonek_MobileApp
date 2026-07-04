import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import { NumericKeypad } from '../../components/NumericKeypad';
import { LockKeyhole } from 'lucide-react-native';
import { apiClient } from '../../api/client';

export default function PinChangeScreen() {
  const [step, setStep] = useState(1); // 1 = old pin, 2 = new pin, 3 = confirm new pin
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKeyPress = (key: string) => {
    if (isLoading) return;

    if (step === 1) {
      if (oldPin.length < 6) {
        const pin = oldPin + key;
        setOldPin(pin);
        if (pin.length === 6) setTimeout(() => setStep(2), 200);
      }
    } else if (step === 2) {
      if (newPin.length < 6) {
        const pin = newPin + key;
        setNewPin(pin);
        if (pin.length === 6) setTimeout(() => setStep(3), 200);
      }
    } else {
      if (confirmPin.length < 6) {
        const pin = confirmPin + key;
        setConfirmPin(pin);
        if (pin.length === 6) verifyAndSave(pin);
      }
    }
  };

  const handleDelete = () => {
    if (isLoading) return;

    if (step === 1 && oldPin.length > 0) {
      setOldPin(oldPin.slice(0, -1));
    } else if (step === 2 && newPin.length > 0) {
      setNewPin(newPin.slice(0, -1));
    } else if (step === 3 && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const verifyAndSave = async (finalPin: string) => {
    if (newPin !== finalPin) {
      Alert.alert('Error', 'New PINs do not match. Please try again.');
      setNewPin('');
      setConfirmPin('');
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('accounts/settings/change-pin/', { 
        old_pin: oldPin, 
        new_pin: newPin 
      });
      
      if (response.status === 200) {
        Alert.alert('Success', 'Quick Login PIN has been changed successfully.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to change PIN. Please check your old PIN.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPin = step === 1 ? oldPin : step === 2 ? newPin : confirmPin;
  const title = step === 1 ? 'Enter Old PIN' : step === 2 ? 'Enter New PIN' : 'Confirm New PIN';
  const subtitle = step === 1 
    ? 'Enter your current 6-digit PIN' 
    : step === 2 
    ? 'Create a new 6-digit PIN' 
    : 'Please re-enter your new PIN';

  return (
    <View className="flex-1 bg-white items-center justify-center pt-20">
      <View className="items-center mb-12">
        <View className="bg-red-50 p-4 rounded-full mb-6">
          <LockKeyhole size={48} color="#DC2626" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">{title}</Text>
        <Text className="text-gray-500 text-center px-8">{subtitle}</Text>
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
