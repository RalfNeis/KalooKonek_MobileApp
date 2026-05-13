/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { User, Phone, Save, Camera } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client'; 
import { supabase } from '../lib/supabase';
import { translations } from '../lib/i18n';

export default function PersonalInfoScreen() {
  const router = useRouter();
  
  const { user, fetchUserFromDjango, language } = useUserStore();
  const t = translations[language]; 

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      
      // Safely extract only the last 9 digits in case the DB has +639 or full 09
      const existingPhone = user.phone_number || '';
      const last9Digits = existingPhone.replace(/\D/g, '').slice(-9);
      setPhone(last9Digits);
      
      setProfileImage(user.profile_picture || null); 
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.permissionDenied, t.photoPermissionMsg);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert(t.error, t.emptyNameError);
      return;
    }

    // Ensure they typed exactly 9 digits after the "09"
    if (phone.length < 9) {
      Alert.alert(t.error, language === 'tl' ? 'Mangyaring ilagay ang buong 11-digit mobile number.' : 'Please enter a valid 11-digit mobile number.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('first_name', firstName.trim());
      formData.append('last_name', lastName.trim());
      
      // Reattach the "09" before sending to Django
      formData.append('phone_number', '09' + phone);
      
      // We pass the existing patient_info to ensure we don't accidentally delete their barangay!
      formData.append('patient_info', JSON.stringify({
        ...(user?.patient_info || {})
      }));

      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('profile_picture', {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      const { data: { session } } = await supabase.auth.getSession();
      const baseUrl = apiClient.defaults.baseURL || 'http://10.0.2.2:8000/';

      const response = await fetch(`${baseUrl}user/`, {
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save profile on the server.');
      }

      await fetchUserFromDjango();
      Alert.alert(t.success, t.profileUpdated);
      router.back();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert(t.error, t.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#F8F9FA]">
      
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100 shadow-sm z-10 flex-row items-center">
        <Text className="text-xl font-bold text-gray-900">{t.personalInfo}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        
        <View className="items-center mb-8">
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className="relative"
          >
            <View className="w-28 h-28 rounded-full bg-orange-100 items-center justify-center overflow-hidden border-4 border-white shadow-sm">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-full h-full" />
              ) : (
                <User size={50} color="#DC2626" />
              )}
            </View>
            
            <View className="absolute bottom-0 right-0 bg-red-600 w-10 h-10 rounded-full border-4 border-white items-center justify-center shadow-sm">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-gray-400 text-xs mt-3 font-medium">{t.tapToChangePhoto}</Text>
        </View>

        <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">{t.firstName}</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={firstName} onChangeText={setFirstName} className="flex-1 text-gray-900 font-medium text-base" placeholder={t.firstName} />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">{t.lastName}</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={lastName} onChangeText={setLastName} className="flex-1 text-gray-900 font-medium text-base" placeholder={t.lastName} />
            </View>
          </View>

          {/* FIX: Locked "09" prefix and restricted to exactly 9 additional numbers */}
          <View className="mb-2">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">{t.mobileNumber}</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <Text className="text-gray-900 text-base mr-1">09</Text>
              <TextInput 
                value={phone} 
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} // Strips anything that isn't a number
                keyboardType="number-pad" 
                maxLength={9} // 9 digits + our fixed 09 = 11 Philippine format
                className="flex-1 text-gray-900 font-medium text-base tracking-widest" 
                placeholder="XXXXXXXXX" 
              />
            </View>
          </View>

        </View>

        <TouchableOpacity onPress={handleSave} disabled={isSaving} className={`w-full rounded-2xl py-4 flex-row items-center justify-center shadow-sm ${isSaving ? 'bg-red-400' : 'bg-red-600'}`}>
          {isSaving ? <ActivityIndicator color="white" /> : <><Save size={20} color="white" className="mr-2" /><Text className="text-white font-bold text-lg">{t.saveChanges}</Text></>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}