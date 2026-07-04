/// <reference types="nativewind/types" />
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { apiClient } from '../api/client';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

export default function ChangePassword() {
  const router = useRouter();
  const { clearUser } = useUserStore();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(true);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Automatically send OTP when screen opens
    const sendInitialOTP = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No session found");
        
        await apiClient.post('accounts/settings/send-change-password-otp/', {}, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
      } catch (error: any) {
        Alert.alert('Error', 'Failed to send verification code to your email. Please try again later.');
      } finally {
        setIsSendingCode(false);
      }
    };
    
    sendInitialOTP();
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.replace(/[^0-9]/g, '');
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChangePassword = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      Alert.alert('Incomplete Code', 'Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await apiClient.post('accounts/settings/change-password/', {
        otp_code: fullCode,
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      
      Alert.alert('Success', 'Your password has been changed successfully. Please log in again with your new password.', [
        { 
          text: 'OK', 
          onPress: async () => {
            clearUser();
            await supabase.auth.signOut();
            router.replace('/login');
          } 
        }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to change password.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.join('').length === 6;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      <View className="px-6 pt-16 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">Change Password</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 shadow-xl mt-4">
        {isSendingCode ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2626" />
            <Text className="text-gray-500 mt-4">Sending verification code to your email...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="items-center mb-8">
              <View className="bg-red-50 p-4 rounded-full mb-6">
                <Lock size={32} color="#DC2626" />
              </View>

              <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Security Verification</Text>
              <Text className="text-gray-500 text-center px-4 leading-5">
                We've sent a 6-digit code to your registered email address to authorize this password change.
              </Text>
            </View>

            {/* Code Input Fields */}
            <View className="flex-row justify-between w-full mb-8 px-2">
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

            {isCodeComplete && (
              <View className="animate-fade-in">
                <View className="mb-4">
                  <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">New Password</Text>
                  <TextInput 
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base"
                    placeholder="Enter new password"
                  />
                </View>

                <View className="mb-8">
                  <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Confirm New Password</Text>
                  <TextInput 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base"
                    placeholder="Re-enter new password"
                  />
                </View>

                <TouchableOpacity 
                  className="w-full py-4 rounded-2xl items-center shadow-sm mb-6 bg-red-600"
                  onPress={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="font-bold text-lg tracking-wide text-white">
                      Update Password
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            
            <View className="h-10" />
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
