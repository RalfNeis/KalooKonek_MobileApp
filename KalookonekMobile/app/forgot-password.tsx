/// <reference types="nativewind/types" />
import React from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone } from 'lucide-react-native';

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      
      <View className="px-6 pt-16 pb-10 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">KalooKonek</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 pb-8 shadow-xl">
          <Text className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</Text>
          <Text className="text-gray-500 text-sm mb-10 leading-relaxed">
            Enter the mobile number associated with your account. We will send you instructions to reset your password.
          </Text>

          <View className="mb-8">
            <Text className="text-gray-700 font-bold text-sm mb-2 ml-1">Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                className="flex-1 text-gray-900 text-base"
                placeholder="09XX-XXX-XXXX"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity className="w-full bg-red-600 rounded-2xl py-4 items-center shadow-sm mb-6">
            <Text className="text-white font-bold text-lg">Send Reset Link</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center gap-1">
            <Text className="text-gray-500 text-sm">Remember your password?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-red-600 font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}