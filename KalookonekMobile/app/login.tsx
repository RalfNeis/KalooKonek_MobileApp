/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { QrCode, User as UserIcon, Lock } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { apiClient } from '../api/client'; // <-- Added to fetch the user role from Django

export default function Login() {
  const router = useRouter();
  const [seniorId, setSeniorId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!seniorId || !password) {
      Alert.alert('Error', 'Please enter both your ID and password.');
      return;
    }

    setIsLoading(true);

    // 1. Authenticate with Supabase first
    const { error } = await supabase.auth.signInWithPassword({
      email: seniorId, 
      password: password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
      setIsLoading(false);
      return; // Stop execution
    } 

    // 2. Fetch the profile from Django to check the role
    try {
      const profileResponse = await apiClient.get('accounts/profile/');
      const userRole = profileResponse.data.user.role;

      // THE BOUNCER: Block Admins and Staff
      if (userRole === 'admin' || userRole === 'staff') {
        Alert.alert(
          'Access Denied', 
          'The mobile app is for senior citizens only. Please log in through the KalooKonek Web Dashboard.'
        );
        
        // Wipe the session so they aren't secretly logged in
        await supabase.auth.signOut();
        setIsLoading(false);
        return; 
      }

      // Success! Patient verified. Send them to the dashboard.
      router.replace('/(tabs)');

    } catch (err: any) {
      console.error("Profile check failed:", err);
      Alert.alert('Login Error', 'Could not verify your account role with the server.');
      
      // Wipe the session if the server check fails just to be safe
      await supabase.auth.signOut();
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
        {/* Red Hero Header */}
        <View className="px-6 pt-24 pb-12">
          <View className="flex-row items-center gap-3 mb-8">
            <View className="bg-white/20 p-2.5 rounded-xl"><QrCode size={24} color="white" /></View>
            <Text className="font-bold text-white text-xl tracking-wide">KalooKonek</Text>
          </View>
          <Text className="text-4xl font-black text-white leading-tight mb-3">Digital Access for Caloocan's Seniors</Text>
          <Text className="text-white/80 text-base leading-relaxed">Connect with barangay services, manage health records, and receive urgent updates.</Text>
        </View>

        {/* White Form Card */}
        <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 pb-8 shadow-xl">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back</Text>
          <Text className="text-gray-500 text-sm mb-8">Please enter your Senior ID and password to access your health records.</Text>

          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-sm mb-2 ml-1">Senior ID / Email</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <UserIcon size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                className="flex-1 text-gray-900 text-base"
                placeholder="e.g. citizen@kalookonek.com"
                value={seniorId}
                onChangeText={setSeniorId}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between items-end mb-2 ml-1 pr-1">
              <Text className="text-gray-700 font-bold text-sm">Password</Text>
              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text className="text-red-600 font-bold text-xs">Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Lock size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                className="flex-1 text-gray-900 text-base"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleLogin} 
            disabled={isLoading}
            className={`w-full rounded-2xl py-4 items-center shadow-sm mb-6 ${isLoading ? 'bg-red-400' : 'bg-red-600'}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center gap-1">
            <Text className="text-gray-500 text-sm">Don't have an account yet?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-red-600 font-bold text-sm">Register Here</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}