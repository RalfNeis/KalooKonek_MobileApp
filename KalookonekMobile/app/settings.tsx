/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ScrollView, Switch, Linking, Modal } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { LogOut, User, Shield, ChevronRight, Type, Globe, BellRing, Smartphone, Mail, Lock, Fingerprint, HelpCircle, FileText, Info, CreditCard, X, Phone, Facebook } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';
import { translations } from '../lib/i18n';
import { apiClient } from '../api/client';

export default function Settings() {
  const router = useRouter();
  
  const { user, fetchUserFromDjango, clearUser, language, setLanguage, textScale, setTextScale } = useUserStore();
  const t = translations[language];

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (user?.patient_info) {
      setPushEnabled((user.patient_info as any).wants_push ?? true);
      setEmailEnabled((user.patient_info as any).wants_email ?? false);
      setSmsEnabled((user.patient_info as any).wants_sms ?? false);
    }
  }, [user]);

  const toggleNotification = async (
    type: 'push' | 'email' | 'sms',
    newValue: boolean,
    setter: (val: boolean) => void
  ) => {
    const previous = type === 'push' ? pushEnabled : type === 'email' ? emailEnabled : smsEnabled;
    setter(newValue);

    const endpoints: Record<string, string> = {
      push: 'accounts/settings/push-notifications/',
      email: 'accounts/settings/email-notifications/',
      sms: 'accounts/settings/sms-notifications/',
    };

    const bodyKeys: Record<string, string> = {
      push: 'wants_push',
      email: 'wants_email',
      sms: 'wants_sms',
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const baseUrl = apiClient.defaults.baseURL || 'http://10.0.2.2:8000/';

      const response = await fetch(`${baseUrl}${endpoints[type]}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [bodyKeys[type]]: newValue }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const cleanError = errorText.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 250);
        throw new Error(cleanError);
      }

      fetchUserFromDjango();
    } catch (error: any) {
      console.error(`Failed to update ${type} notification:`, error);
      Alert.alert('Error', error.message || 'Could not save changes.');
      setter(previous); // Revert on failure
    }
  };

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
        
        {/* ACCOUNT SECTION */}
        <Text className="text-gray-500 font-bold mb-3 ml-2 uppercase tracking-wider" style={{ fontSize: 12 * textScale }}>
          Account
        </Text>
        <View className="bg-white rounded-2xl px-4 pt-2 pb-2 mb-6 shadow-sm border border-gray-100">
          <MenuItem icon={User} label="Edit Profile Info" onPress={() => router.push('/personal-info')} />
          <MenuItem icon={CreditCard} label="View OSCA ID" onPress={() => router.push('/qrcode')} />
        </View>

        {/* ACCESSIBILITY SECTION */}
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

        {/* PRIVACY & SECURITY SECTION */}
        <Text className="text-gray-500 font-bold mb-3 ml-2 uppercase tracking-wider" style={{ fontSize: 12 * textScale }}>
          Privacy & Security
        </Text>
        <View className="bg-white rounded-2xl px-4 pt-2 pb-2 mb-6 shadow-sm border border-gray-100">
          <MenuItem icon={Lock} label="Change Password" onPress={() => router.push('/change-password')} />
          <View className="flex-row items-center justify-between py-4 min-h-[64px]">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-gray-50 p-2 rounded-lg mr-3">
                <Fingerprint size={20} color="#4B5563" />
              </View>
              <Text className="text-gray-700 font-medium flex-1 flex-wrap leading-relaxed" style={{ fontSize: 16 * textScale }}>Enable Biometric Login</Text>
            </View>
            <Switch 
              value={biometricsEnabled} 
              onValueChange={setBiometricsEnabled} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* NOTIFICATIONS SECTION */}
        <Text className="text-gray-500 font-bold mb-3 ml-2 uppercase tracking-wider" style={{ fontSize: 12 * textScale }}>
          {t.notifications || 'Notifications'}
        </Text>
        
        <View className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-gray-100">
          {/* Push Notifications */}
          <View className="flex-row items-center justify-between min-h-[56px] border-b border-gray-50 pb-4">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-blue-50 p-2 rounded-lg mr-3">
                <BellRing size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium flex-wrap" style={{ fontSize: 16 * textScale }}>
                  {t.pushNotifs || 'Push Notifications'}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5 flex-wrap">
                  {t.pushDesc || 'Alerts for appointments & updates'}
                </Text>
              </View>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={(val) => toggleNotification('push', val, setPushEnabled)} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* Email Notifications */}
          <View className="flex-row items-center justify-between min-h-[56px] border-b border-gray-50 py-4">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-purple-50 p-2 rounded-lg mr-3">
                <Mail size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium flex-wrap" style={{ fontSize: 16 * textScale }}>
                  {t.emailUpdates || 'Email Updates'}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5 flex-wrap">
                  {t.emailDesc || 'Receive summaries via email'}
                </Text>
              </View>
            </View>
            <Switch 
              value={emailEnabled} 
              onValueChange={(val) => toggleNotification('email', val, setEmailEnabled)} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>

          {/* SMS Notifications */}
          <View className="flex-row items-center justify-between min-h-[56px] pt-4">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-emerald-50 p-2 rounded-lg mr-3">
                <Smartphone size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium flex-wrap" style={{ fontSize: 16 * textScale }}>
                  {t.smsTexts || 'SMS Text Messages'}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5 flex-wrap">
                  {t.smsDesc || 'Text reminders to your phone'}
                </Text>
              </View>
            </View>
            <Switch 
              value={smsEnabled} 
              onValueChange={(val) => toggleNotification('sms', val, setSmsEnabled)} 
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* SUPPORT & ABOUT SECTION */}
        <Text className="text-gray-500 font-bold mb-3 ml-2 uppercase tracking-wider" style={{ fontSize: 12 * textScale }}>
          Support & About
        </Text>
        <View className="bg-white rounded-2xl px-4 pt-2 pb-2 mb-8 shadow-sm border border-gray-100">
          <MenuItem icon={HelpCircle} label="Contact Barangay" onPress={() => setShowContactModal(true)} />
          <MenuItem icon={FileText} label="Terms of Service" onPress={() => router.push('/terms')} />
          <View className="flex-row items-center justify-between py-4 min-h-[64px]">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-gray-50 p-2 rounded-lg mr-3">
                <Info size={20} color="#4B5563" />
              </View>
              <Text className="text-gray-700 font-medium flex-1 flex-wrap leading-relaxed" style={{ fontSize: 16 * textScale }}>App Version</Text>
            </View>
            <Text className="text-gray-400 font-medium">1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white rounded-2xl p-4 flex-row items-center justify-center shadow-sm border border-red-100 mb-8 min-h-[56px]"
        >
          <LogOut size={20} color="#DC2626" className="mr-2" />
          <Text className="text-red-600 font-bold flex-wrap text-center" style={{ fontSize: 16 * textScale }}>{t.signOut}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Contact Barangay Modal */}
      <Modal visible={showContactModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl w-full p-6 shadow-2xl">
            <View className="flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <Text className="font-bold text-gray-900" style={{ fontSize: 20 * textScale }}>Administrative Contact</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-500 font-bold uppercase tracking-wider mb-2" style={{ fontSize: 12 * textScale }}>Office Hours</Text>
              <Text className="text-gray-800 font-medium" style={{ fontSize: 16 * textScale }}>8:00 AM - 5:00 PM</Text>
              <Text className="text-gray-600 mt-1" style={{ fontSize: 14 * textScale }}>Monday to Friday</Text>
            </View>

            <TouchableOpacity 
              onPress={() => Linking.openURL('tel:09123456789')}
              className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100"
            >
              <View className="bg-green-100 p-2 rounded-full mr-4">
                <Phone size={20} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-bold uppercase">Phone Number</Text>
                <Text className="text-gray-900 font-medium mt-1" style={{ fontSize: 16 * textScale }}>0912 345 6789</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Linking.openURL('mailto:support@caloocancity.gov.ph')}
              className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100"
            >
              <View className="bg-blue-100 p-2 rounded-full mr-4">
                <Mail size={20} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-bold uppercase">Email Address</Text>
                <Text className="text-gray-900 font-medium mt-1" style={{ fontSize: 16 * textScale }}>support@caloocancity.gov.ph</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Linking.openURL('https://facebook.com')}
              className="w-full bg-[#1877F2] rounded-2xl py-4 flex-row justify-center items-center shadow-sm"
            >
              <Facebook size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold" style={{ fontSize: 16 * textScale }}>Visit Official Facebook Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}