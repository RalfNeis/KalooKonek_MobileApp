/// <reference types="nativewind/types" />
import React from 'react';
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { LogOut, User, Bell, Shield, ChevronRight, Type, Globe } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';
import { translations } from '../lib/i18n';

export default function Settings() {
  const router = useRouter();
  
  const { clearUser, language, setLanguage, textScale, setTextScale } = useUserStore();
  const t = translations[language];

  const handleLogout = async () => {
    Alert.alert(
      t.signOut,
      t.signOutConfirm,
      [
        { text: t.cancel, style: "cancel" },
        { 
          text: t.signOut, 
          style: "destructive",
          onPress: async () => {
            clearUser();
            await supabase.auth.signOut();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon: Icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    // FIX: Added min-h to allow vertical growth
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-4 border-b border-gray-100 min-h-[64px]">
      {/* FIX: Added flex-1 and pr-4 so the text has boundaries and doesn't eat the chevron */}
      <View className="flex-row items-center flex-1 pr-4">
        <View className="bg-gray-50 p-2 rounded-lg mr-3">
          <Icon size={20} color="#4B5563" />
        </View>
        {/* FIX: Added flex-1 and flex-wrap to force huge text onto a new line safely */}
        <Text className="text-gray-700 font-medium flex-1 flex-wrap leading-relaxed" style={{ fontSize: 16 * textScale }}>{label}</Text>
      </View>
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="font-bold text-gray-900" style={{ fontSize: 20 * textScale }}>{t.settingsTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        <Text className="text-gray-500 font-bold mb-3 ml-2 uppercase tracking-wider" style={{ fontSize: 12 * textScale }}>
          {t.accessibility}
        </Text>
        
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
          
          {/* FIX: Changed justify-between to flex-wrap with a gap so controls stack if text is huge */}
          <View className="flex-row flex-wrap items-center justify-between mb-6 gap-4">
            <View className="flex-row items-center flex-1 min-w-[120px]">
              <Globe size={20} color="#4B5563" className="mr-3" />
              <Text className="text-gray-700 font-medium flex-1 flex-wrap" style={{ fontSize: 16 * textScale }}>{t.language}</Text>
            </View>
            <View className="flex-row bg-gray-100 rounded-lg p-1">
              <TouchableOpacity 
                onPress={() => setLanguage('en')}
                className={`px-4 py-2 rounded-md ${language === 'en' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`font-bold ${language === 'en' ? 'text-red-600' : 'text-gray-500'}`}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setLanguage('tl')}
                className={`px-4 py-2 rounded-md ${language === 'tl' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`font-bold ${language === 'tl' ? 'text-red-600' : 'text-gray-500'}`}>TL</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FIX: Added flex-wrap and gap here as well */}
          <View className="flex-row flex-wrap items-center justify-between gap-4">
            <View className="flex-row items-center flex-1 min-w-[120px]">
              <Type size={20} color="#4B5563" className="mr-3" />
              <Text className="text-gray-700 font-medium flex-1 flex-wrap" style={{ fontSize: 16 * textScale }}>{t.textSize}</Text>
            </View>
            <View className="flex-row bg-gray-100 rounded-lg p-1 items-center">
              <TouchableOpacity onPress={() => setTextScale(1)} className={`px-4 py-2 rounded-md ${textScale === 1 ? 'bg-white shadow-sm' : ''}`}>
                <Text className={`font-bold text-sm ${textScale === 1 ? 'text-red-600' : 'text-gray-500'}`}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTextScale(1.2)} className={`px-4 py-2 rounded-md ${textScale === 1.2 ? 'bg-white shadow-sm' : ''}`}>
                <Text className={`font-bold text-base ${textScale === 1.2 ? 'text-red-600' : 'text-gray-500'}`}>A+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTextScale(1.4)} className={`px-4 py-2 rounded-md ${textScale === 1.4 ? 'bg-white shadow-sm' : ''}`}>
                <Text className={`font-bold text-lg ${textScale === 1.4 ? 'text-red-600' : 'text-gray-500'}`}>A++</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl px-4 pt-2 pb-2 mb-8 shadow-sm border border-gray-100">
          <MenuItem icon={User} label={t.personalInfo} onPress={() => router.push('/personal-info')} />
          <MenuItem icon={Bell} label={t.notifications} onPress={() => router.push('/notifications')} />
          <MenuItem icon={Shield} label={t.privacy} onPress={() => router.push('/security')} />
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white rounded-2xl p-4 flex-row items-center justify-center shadow-sm border border-red-100 mb-8 min-h-[56px]"
        >
          <LogOut size={20} color="#DC2626" className="mr-2" />
          <Text className="text-red-600 font-bold flex-wrap text-center" style={{ fontSize: 16 * textScale }}>{t.signOut}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}