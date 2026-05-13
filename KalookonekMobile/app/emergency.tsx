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

  // --- 1. THE SOS LONG-PRESS LOGIC ---
  const handleSOS = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.permissionDenied, t.locationPermissionMsg);
        setIsLocating(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      const guardianNumber = user?.patient_info?.emergency_contact_number || '';
      const barangayHotline = '09123456789'; 

      const isAvailable = await SMS.isAvailableAsync();
      
      if (isAvailable) {
        // Construct the translated SMS message
        const smsMessage = `${t.sosHelp} \n\n${t.sosName}: ${user?.first_name} ${user?.last_name}\n${t.sosLocation}: ${mapsLink}`;
        
        await SMS.sendSMSAsync(
          [guardianNumber, barangayHotline].filter(Boolean), 
          smsMessage
        );
      } else {
        Alert.alert(t.error, t.smsNotAvailable);
      }

    } catch (error) {
      Alert.alert(t.error, t.locationError);
    } finally {
      setIsLocating(false);
    }
  };

  const callAmbulance = () => {
    Linking.openURL('tel:911'); 
  };

  const callBarangay = () => {
    Linking.openURL('tel:122'); 
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