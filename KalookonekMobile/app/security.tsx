/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function SecurityScreen() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsUpdating(true);
    try {
      // Supabase natively handles updating the authenticated user's password!
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert('Success', 'Your password has been securely updated.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password.');
    } finally {
      setIsUpdating(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-xl font-bold text-gray-900">Privacy & Security</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="bg-red-50 p-2 rounded-xl">
              <ShieldCheck size={24} color="#DC2626" />
            </View>
            <Text className="font-bold text-gray-900 text-lg">Change Password</Text>
          </View>

          {/* New Password Input */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">New Password</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Lock size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="flex-1 text-gray-900 font-medium" 
                placeholder="Enter new password" 
              />
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Confirm Password</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Lock size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="flex-1 text-gray-900 font-medium" 
                placeholder="Confirm new password" 
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleUpdatePassword}
            disabled={isUpdating}
            className={`w-full rounded-xl py-4 items-center shadow-sm ${isUpdating ? 'bg-red-400' : 'bg-red-600'}`}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Update Password</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-gray-400 text-center px-4 leading-relaxed mt-2">
          Your data is encrypted and securely stored. We will never share your personal information without your consent.
        </Text>

      </ScrollView>
    </View>
  );
}