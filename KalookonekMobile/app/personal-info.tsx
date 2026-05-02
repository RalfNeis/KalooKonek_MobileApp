/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, MapPin, Save } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';

// Assuming you have an API client set up for your backend requests. 
// Adjust this import path if yours is located somewhere else!
import { apiClient } from '../api/client';

export default function PersonalInfoScreen() {
  const router = useRouter();
  
  // Pull the current user data AND the fetch function so we can refresh the app after saving
  const { user, fetchUserFromDjango } = useUserStore();

  // --- Form State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Auto-Fill the Form ---
  // When the screen loads, populate the inputs with the data from the store
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone_number || '');
      setBarangay(user.patient_info?.barangay || '');
    }
  }, [user]);

  // --- Save Function ---
  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'First Name and Last Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Send the updated data to your Django backend
      await apiClient.put('user/', {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        patient_info: {
          ...(user?.patient_info || {}), // Keep any existing patient info intact
          barangay: barangay
        }
      });

      // 2. Refresh the global Zustand store so the Dashboard and QR code update instantly
      await fetchUserFromDjango();

      // 3. Notify the user and go back
      Alert.alert('Success', 'Your profile has been updated!');
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Could not save changes. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#F8F9FA]">
      
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-xl font-bold text-gray-900">Personal Information</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        
        <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
          
          {/* First Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">First Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={firstName} 
                onChangeText={setFirstName}
                className="flex-1 text-gray-900 font-medium" 
                placeholder="First Name" 
              />
            </View>
          </View>

          {/* Last Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Last Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={lastName} 
                onChangeText={setLastName}
                className="flex-1 text-gray-900 font-medium" 
                placeholder="Last Name" 
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={phone} 
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="flex-1 text-gray-900 font-medium" 
                placeholder="09XX-XXX-XXXX" 
              />
            </View>
          </View>

          {/* Barangay */}
          <View className="mb-2">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Barangay</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <MapPin size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={barangay} 
                onChangeText={setBarangay}
                className="flex-1 text-gray-900 font-medium" 
                placeholder="e.g. 171" 
              />
            </View>
          </View>

        </View>

        {/* Save Button */}
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isSaving}
          className={`w-full rounded-2xl py-4 flex-row items-center justify-center shadow-sm ${isSaving ? 'bg-red-400' : 'bg-red-600'}`}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}