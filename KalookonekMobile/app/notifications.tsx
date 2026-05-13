/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Switch, Alert } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { BellRing, Smartphone, Mail } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';
import { translations } from '../lib/i18n';

export default function NotificationsScreen() {
  const { user, fetchUserFromDjango, language } = useUserStore();
  const t = translations[language];

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // 1. Load existing preferences from the database when the screen opens
  useEffect(() => {
    if (user?.patient_info) {
      setPushEnabled((user.patient_info as any).wants_push ?? true);
      setSmsEnabled((user.patient_info as any).wants_sms ?? true);
      setEmailEnabled((user.patient_info as any).wants_email ?? false);
    }
  }, [user]);

  // 2. The Optimistic Toggle Logic
  const toggleSetting = async (type: 'push' | 'sms' | 'email', newValue: boolean) => {
    // Instantly update UI
    if (type === 'push') setPushEnabled(newValue);
    if (type === 'sms') setSmsEnabled(newValue);
    if (type === 'email') setEmailEnabled(newValue);

    try {
      // Package the updated settings
      const updatedPatientInfo = {
        ...(user?.patient_info || {}),
        wants_push: type === 'push' ? newValue : pushEnabled,
        wants_sms: type === 'sms' ? newValue : smsEnabled,
        wants_email: type === 'email' ? newValue : emailEnabled,
      };

      // Send to Django
      await apiClient.put('user/', {
        patient_info: updatedPatientInfo
      });

      // Silently sync the global store
      fetchUserFromDjango();
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      Alert.alert(t.error || 'Error', t.saveError || 'Could not save changes.');
      
      // Revert the UI if the server request fails
      if (type === 'push') setPushEnabled(!newValue);
      if (type === 'sms') setSmsEnabled(!newValue);
      if (type === 'email') setEmailEnabled(!newValue);
    }
  };

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <View className="px-6 pt-6 pb-4 flex-row items-center bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-xl font-bold text-gray-900">{t.notifications}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-gray-500 text-sm mb-6 leading-relaxed flex-wrap">
          {t.notificationsDesc}
        </Text>

        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          
          {/* Push Notifications */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-50 min-h-[88px]">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-blue-50 p-2 rounded-xl">
                <BellRing size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 flex-wrap leading-tight">{t.pushNotifs}</Text>
                <Text className="text-xs text-gray-500 mt-0.5 flex-wrap leading-tight">{t.pushDesc}</Text>
              </View>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={(val) => toggleSetting('push', val)} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* SMS Notifications */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-50 min-h-[88px]">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-emerald-50 p-2 rounded-xl">
                <Smartphone size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 flex-wrap leading-tight">{t.smsTexts}</Text>
                <Text className="text-xs text-gray-500 mt-0.5 flex-wrap leading-tight">{t.smsDesc}</Text>
              </View>
            </View>
            <Switch 
              value={smsEnabled} 
              onValueChange={(val) => toggleSetting('sms', val)}
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* Email Notifications */}
          <View className="flex-row items-center justify-between p-5 min-h-[88px]">
            <View className="flex-row items-center gap-4 flex-1 pr-4">
              <View className="bg-purple-50 p-2 rounded-xl">
                <Mail size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 flex-wrap leading-tight">{t.emailUpdates}</Text>
                <Text className="text-xs text-gray-500 mt-0.5 flex-wrap leading-tight">{t.emailDesc}</Text>
              </View>
            </View>
            <Switch 
              value={emailEnabled} 
              onValueChange={(val) => toggleSetting('email', val)}
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

        </View>
      </ScrollView>
    </View>
  );
}