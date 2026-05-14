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

const SUPABASE_PIC_URL = 'https://lukdudigghvsqizkukeq.supabase.co/storage/v1/object/public/profile-pictures/';

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
      
      const existingPhone = user.phone_number || '';
      const last9Digits = existingPhone.replace(/\D/g, '').slice(-9);
      setPhone(last9Digits);
      
      if (user.profile_picture) {
        if (user.profile_picture.startsWith('http')) {
          setProfileImage(user.profile_picture);
        } else {
          setProfileImage(`${SUPABASE_PIC_URL}${user.profile_picture}`);
        }
      }
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.permissionDenied || 'Permission Denied', t.photoPermissionMsg || 'We need access to your photos.');
      return;
    }

    // FIX: Updated to the new MediaType syntax to remove the terminal warning
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
      Alert.alert(t.error || 'Error', t.emptyNameError || 'Please fill in all fields.');
      return;
    }

    if (phone.length < 9) {
      Alert.alert(t.error || 'Error', language === 'tl' ? 'Mangyaring ilagay ang buong 11-digit mobile number.' : 'Please enter a valid 11-digit mobile number.');
      return;
    }

    setIsSaving(true);
    try {
      // --- 1. FILE UPLOAD (RAW BINARY DIRECT TO REST API) ---
      if (profileImage && !profileImage.startsWith('http')) {
        
        // 1a. Grab the current session for authorization AND the strict UUID
        const { data: { session } } = await supabase.auth.getSession();
        
        // FIX: Use the secret Supabase UUID to pass the Row-Level Security policy!
        const userId = session?.user?.id || 'unknown';
        const fileExt = profileImage.split('.').pop() || 'jpg';
        const filePath = `${userId}/avatar.${fileExt}`;
        const contentType = `image/${fileExt === 'png' ? 'png' : 'jpeg'}`;

        // 1b. Convert local URI to a raw binary Blob
        const fileResp = await fetch(profileImage);
        const rawBlob = await fileResp.blob();

        // 1c. Direct REST POST to bypass the supabase-js Native bugs
        const uploadUrl = `https://lukdudigghvsqizkukeq.supabase.co/storage/v1/object/profile-pictures/${filePath}`;
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': contentType,
            'x-upsert': 'true', 
          },
          body: rawBlob, 
        });

        if (!uploadResponse.ok) {
          const errText = await uploadResponse.text();
          throw new Error(`Supabase Rejected: ${errText}`);
        }

        // --- 2. DATABASE UPDATE (DJANGO ENDPOINT) ---
        await apiClient.put('accounts/profile/update/', {
          profile_picture: filePath
        });
      }

      // --- 3. SAVE REMAINING TEXT DATA ---
      await apiClient.put('user/', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: '09' + phone,
        patient_info: {
          ...(user?.patient_info || {})
        }
      });

      await fetchUserFromDjango();
      Alert.alert(t.success || 'Success', t.profileUpdated || 'Profile updated successfully.');
      router.back();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert(t.error || 'Upload Error', error.message || 'Could not save changes.');
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
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="relative">
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

          <View className="mb-2">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">{t.mobileNumber}</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <Text className="text-gray-900 font-bold text-base mr-1">09</Text>
              <TextInput 
                value={phone} 
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} 
                keyboardType="number-pad" 
                maxLength={9} 
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