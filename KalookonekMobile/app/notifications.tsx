/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, BellRing, Smartphone, Mail } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  // Local state for the toggle switches
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
          Choose how you want to receive updates about your appointments, medicines, and barangay announcements.
        </Text>

        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          
          {/* Push Notifications */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-50">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-blue-50 p-2 rounded-xl">
                <BellRing size={20} color="#3B82F6" />
              </View>
              <View>
                <Text className="font-bold text-gray-900">Push Notifications</Text>
                <Text className="text-xs text-gray-500 mt-0.5">Alerts sent directly to your phone screen</Text>
              </View>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={setPushEnabled} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* SMS Notifications */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-50">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-emerald-50 p-2 rounded-xl">
                <Smartphone size={20} color="#10B981" />
              </View>
              <View>
                <Text className="font-bold text-gray-900">SMS Texts</Text>
                <Text className="text-xs text-gray-500 mt-0.5">Receive text messages for urgent updates</Text>
              </View>
            </View>
            <Switch 
              value={smsEnabled} 
              onValueChange={setSmsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* Email Notifications */}
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-purple-50 p-2 rounded-xl">
                <Mail size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text className="font-bold text-gray-900">Email Updates</Text>
                <Text className="text-xs text-gray-500 mt-0.5">Weekly newsletters and detailed reports</Text>
              </View>
            </View>
            <Switch 
              value={emailEnabled} 
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

        </View>
      </ScrollView>
    </View>
  );
}