/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { Bell, ShieldAlert } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { useUserStore } from '../store/useUserStore';

export default function Emergency() {
  const { user } = useUserStore();
  const [isLocating, setIsLocating] = useState(false);

  // --- 1. THE SOS LONG-PRESS LOGIC ---
  const handleSOS = async () => {
    setIsLocating(true);
    try {
      // Request GPS Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access in your phone settings so responders can find you.');
        setIsLocating(false);
        return;
      }

      // Grab the precise coordinates
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      
      // Create a clickable Google Maps link
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      // Get the user's emergency contact from the database, fallback to a default if missing
      const guardianNumber = user?.patient_info?.emergency_contact_number || '';
      const barangayHotline = '09123456789'; // Replace with actual Barangay number

      // Check if the device can send SMS (iPads/Simulators often can't)
      const isAvailable = await SMS.isAvailableAsync();
      
      if (isAvailable) {
        // Automatically open the SMS app with the text and numbers pre-filled
        await SMS.sendSMSAsync(
          [guardianNumber, barangayHotline].filter(Boolean), // Removes empty strings
          `EMERGENCY SOS! I need help. \n\nName: ${user?.first_name} ${user?.last_name}\nMy current location: ${mapsLink}`
        );
      } else {
        Alert.alert('Error', 'SMS is not available on this device.');
      }

    } catch (error) {
      Alert.alert('Error', 'Could not fetch your location. Please try calling directly.');
    } finally {
      setIsLocating(false);
    }
  };

  // --- 2. QUICK DIAL LOGIC ---
  // Using React Native's Linking API to open the phone dialer
  const callAmbulance = () => {
    Linking.openURL('tel:911'); // Or 143 for Red Cross Philippines
  };

  const callBarangay = () => {
    Linking.openURL('tel:122'); // Replace with Caloocan Command Center number
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      
      {/* Massive SOS Button Wrapper */}
      <View className="items-center justify-center py-10 mt-4 mb-8">
        <TouchableOpacity 
          onLongPress={handleSOS}
          delayLongPress={3000} // Requires holding for exactly 3 seconds
          className={`w-64 h-64 rounded-full items-center justify-center shadow-lg shadow-red-500/50 ${isLocating ? 'bg-red-400' : 'bg-red-600'}`}
          activeOpacity={0.7}
        >
          {isLocating ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <Bell size={64} color="white" className="mb-2" />
              <Text className="text-5xl font-black text-white tracking-widest mt-2">SOS</Text>
              <Text className="text-white/80 font-medium text-sm mt-3">Press for 3 Seconds</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 text-center text-sm mb-10 px-4 leading-relaxed">
        Holding the SOS button will grab your GPS location and draft an emergency text to your listed guardian and the Barangay.
      </Text>

      {/* Quick Action Cards */}
      <View className="flex-row justify-between">
        
        {/* Ambulance Dial */}
        <TouchableOpacity 
          onPress={callAmbulance}
          className="w-[48%] bg-white border border-gray-100 rounded-3xl p-5 shadow-sm items-center justify-center py-8"
        >
          <View className="bg-red-50 p-4 rounded-2xl mb-3">
            <Bell size={28} color="#DC2626" /> 
          </View>
          <View className="items-center">
            <Text className="font-bold text-gray-900 text-base text-center mb-1">Ambulance</Text>
            <Text className="text-xs text-gray-500 text-center">Tap to Call</Text>
          </View>
        </TouchableOpacity>

        {/* Security Dial */}
        <TouchableOpacity 
          onPress={callBarangay}
          className="w-[48%] bg-white border border-gray-100 rounded-3xl p-5 shadow-sm items-center justify-center py-8"
        >
          <View className="bg-blue-50 p-4 rounded-2xl mb-3">
            <ShieldAlert size={28} color="#2563EB" />
          </View>
          <View className="items-center">
            <Text className="font-bold text-gray-900 text-base text-center mb-1">Brgy. Security</Text>
            <Text className="text-xs text-gray-500 text-center">Tap to Call</Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}