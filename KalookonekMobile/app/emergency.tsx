/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Bell, ShieldAlert } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { useUserStore } from '../store/useUserStore';
import { translations } from '../lib/i18n'; // <-- Import dictionary

export default function Emergency() {
  // Pull language from store
  const { user, language } = useUserStore();
  const t = translations[language]; // Get the right words
  const [isLocating, setIsLocating] = useState(false);

  // Extract barangay number. e.g., "Brgy. 105" -> "105"
  const barangayNumber = user?.patient_info?.barangay?.replace(/[^0-9]/g, '') || '';
  
  // Mapping of barangay hotlines. Fallback to 122 if not listed.
  const barangayHotlines: Record<string, string> = {
    '105': '09123456789', // Example dynamically assigned number
    '106': '09987654321',
  };
  const dynamicHotline = barangayHotlines[barangayNumber] || '122';

  // --- 1. THE SOS LONG-PRESS LOGIC ---
  const handleSOS = async () => {
    setIsLocating(true);
    let mapsLink = '';

    try {
      // 1. Attempt to get location, but DO NOT block if denied
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      } else {
        console.warn("Location permission denied. Sending SOS without coordinates.");
      }
    } catch (error) {
      console.warn("Failed to fetch location. Proceeding without coordinates.", error);
    }

    try {
      // 2. Attempt to send SMS
      const guardianNumber = user?.patient_info?.emergency_contact_number || '';
      const isAvailable = await SMS.isAvailableAsync();
      
      if (isAvailable) {
        const locationText = mapsLink ? `\n${t.sosLocation}: ${mapsLink}` : `\n(Location Unavailable)`;
        const smsMessage = `${t.sosHelp} \n\n${t.sosName}: ${user?.first_name} ${user?.last_name}${locationText}`;
        
        await SMS.sendSMSAsync(
          [guardianNumber, dynamicHotline].filter(Boolean), 
          smsMessage
        );
      }
    } catch (error) {
      console.warn("SMS failed or cancelled.", error);
    } finally {
      setIsLocating(false);
      
      // 3. ULTIMATE FAIL-SAFE: Unconditionally trigger native cellular call
      Linking.openURL(`tel:${dynamicHotline}`);
    }
  };

  const callAmbulance = () => {
    Linking.openURL('tel:911'); 
  };

  const callBarangay = () => {
    Linking.openURL(`tel:${dynamicHotline}`); 
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      
      {/* Massive SOS Button Wrapper - Added padding and wrap to protect text */}
      <View className="items-center justify-center py-10 mt-4 mb-8">
        <TouchableOpacity 
          onLongPress={handleSOS}
          delayLongPress={3000} 
          className={`w-64 h-64 rounded-full items-center justify-center shadow-lg shadow-red-500/50 p-4 ${isLocating ? 'bg-red-400' : 'bg-red-600'}`}
          activeOpacity={0.7}
        >
          {isLocating ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <Bell size={64} color="white" className="mb-2" />
              <Text className="text-5xl font-black text-white tracking-widest mt-2">{t.sos}</Text>
              <Text className="text-white/80 font-medium text-sm mt-3 text-center flex-wrap leading-tight">{t.pressFor3Seconds}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 text-center text-sm mb-10 px-4 leading-relaxed flex-wrap">
        {t.sosDescription}
      </Text>

      {/* Quick Action Cards */}
      <View className="flex-row justify-between">
        
        {/* Ambulance Dial - FIX: Swapped py-8 for min-h-[160px] and added wrapping text */}
        <TouchableOpacity 
          onPress={callAmbulance}
          className="w-[48%] bg-white border border-gray-100 rounded-3xl p-4 shadow-sm items-center justify-center min-h-[160px]"
        >
          <View className="bg-red-50 p-4 rounded-2xl mb-3">
            <Bell size={28} color="#DC2626" /> 
          </View>
          <View className="items-center w-full">
            <Text className="font-bold text-gray-900 text-base text-center mb-1 flex-wrap w-full leading-tight">{t.ambulance}</Text>
            <Text className="text-xs text-gray-500 text-center flex-wrap w-full leading-tight">{t.tapToCall}</Text>
          </View>
        </TouchableOpacity>

        {/* Security Dial - FIX: Swapped py-8 for min-h-[160px] and added wrapping text */}
        <TouchableOpacity 
          onPress={callBarangay}
          className="w-[48%] bg-white border border-gray-100 rounded-3xl p-4 shadow-sm items-center justify-center min-h-[160px]"
        >
          <View className="bg-blue-50 p-4 rounded-2xl mb-3">
            <ShieldAlert size={28} color="#2563EB" />
          </View>
          <View className="items-center w-full">
            <Text className="font-bold text-gray-900 text-base text-center mb-1 flex-wrap w-full leading-tight">{t.brgySecurity}</Text>
            <Text className="text-xs text-gray-500 text-center flex-wrap w-full leading-tight">{t.tapToCall}</Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}