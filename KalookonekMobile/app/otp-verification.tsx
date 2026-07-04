/// <reference types="nativewind/types" />
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MailOpen } from 'lucide-react-native';
import { apiClient } from '../api/client';

export default function OTPVerification() {
  const router = useRouter();
  const { email, password, action } = useLocalSearchParams();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(30);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // 5-minute expiry countdown
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // 30-second resend cooldown
    const cooldown = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(cooldown);
    };
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.replace(/[^0-9]/g, ''); // Ensure only digits
    setCode(newCode);

    // Auto-advance
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace auto-reverse
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      Alert.alert('Incomplete Code', 'Please enter the 6-digit verification code.');
      return;
    }

    if (timer === 0) {
      Alert.alert('Code Expired', 'Please request a new code.');
      return;
    }

    setIsLoading(true);

    try {
      if (action === 'signup') {
        const response = await apiClient.post('emails/signup/verify-otp/', {
          email,
          code: fullCode,
          password
        });
        
        Alert.alert('Registration Verified', 'Your registration is now pending Barangay Staff approval.', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      } else {
        Alert.alert('Error', 'Unknown verification action.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Verification failed.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      if (action === 'signup') {
        Alert.alert('Notice', 'To receive a new code, please go back and submit the registration form again.', [
          { text: 'Go Back', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      <View className="px-6 pt-16 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">Verification</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 shadow-xl mt-4 items-center">
        <View className="bg-red-50 p-4 rounded-full mb-6">
          <MailOpen size={32} color="#DC2626" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Enter Verification Code</Text>
        <Text className="text-gray-500 text-center mb-8 px-4 leading-5">
          We've sent a 6-digit code to{'\n'}
          <Text className="font-bold text-gray-900">{email}</Text>
        </Text>

        {/* Code Input Fields */}
        <View className="flex-row justify-between w-full mb-6 px-2">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className={`w-12 h-14 bg-gray-50 border ${digit ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-900'} rounded-xl text-2xl font-bold text-center`}
            />
          ))}
        </View>

        <Text className={`text-sm font-medium mb-8 ${timer === 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {timer === 0 ? 'Code Expired' : `Code expires in ${formatTime(timer)}`}
        </Text>

        <TouchableOpacity 
          className={`w-full py-4 rounded-2xl items-center shadow-sm mb-6 ${code.join('').length === 6 ? 'bg-red-600' : 'bg-gray-200'}`}
          onPress={handleVerify}
          disabled={code.join('').length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={`font-bold text-lg tracking-wide ${code.join('').length === 6 ? 'text-white' : 'text-gray-400'}`}>
              Verify Code
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-gray-500">Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0 || isLoading}>
            <Text className={`font-bold ${resendCooldown > 0 ? 'text-gray-300' : 'text-red-600'}`}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
