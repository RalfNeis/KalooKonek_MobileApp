/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Switch, Alert } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { BellRing, Smartphone, Mail } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';
import { supabase } from '../lib/supabase';
import { translations } from '../lib/i18n';

export default function NotificationsScreen() {
  const { user, fetchUserFromDjango, language } = useUserStore();
  const t = translations[language];

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    if (user?.patient_info) {
      setPushEnabled((user.patient_info as any).wants_push ?? true);
      setSmsEnabled((user.patient_info as any).wants_sms ?? true);
      setEmailEnabled((user.patient_info as any).wants_email ?? false);
    }
  }, [user]);

  const toggleSetting = async (type: 'push' | 'sms' | 'email', newValue: boolean) => {
    if (type === 'push') setPushEnabled(newValue);
    if (type === 'sms') setSmsEnabled(newValue);
    if (type === 'email') setEmailEnabled(newValue);

    try {
      const updatedPatientInfo = {
        ...(user?.patient_info || {}),
        wants_push: type === 'push' ? newValue : pushEnabled,
        wants_sms: type === 'sms' ? newValue : smsEnabled,
        wants_email: type === 'email' ? newValue : emailEnabled,
      };

      const { data: { session } } = await supabase.auth.getSession();
      const baseUrl = apiClient.defaults.baseURL || 'http://10.0.2.2:8000/';

      // We bypass Axios to guarantee the token and JSON body are formatted flawlessly
      const response = await fetch(`${baseUrl}user/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_info: updatedPatientInfo }),
      });

      if (!response.ok) {
        // THE ERROR EXTRACTOR: This grabs the exact Python traceback from Django!
        const errorHtml = await response.text();
        // Clean up the HTML tags so it's readable on the phone
        const cleanError = errorHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 250);
        throw new Error(`Django Crash: ${cleanError}`);
      }

      fetchUserFromDjango();
      
    } catch (error: any) {
      console.error('Failed to update notification settings:', error);
      Alert.alert('Backend Error', error.message || 'Could not save changes.');
      
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