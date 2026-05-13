/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, User, Phone, MapPin, Save, Camera } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client'; 

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, fetchUserFromDjango } = useUserStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone_number || '');
      setBarangay(user.patient_info?.barangay || '');
      // If Django starts sending a profile_picture URL, it will load here!
      // setProfileImage(user.profile_picture || null); 
    }
  }, [user]);

  // --- Image Picker Function ---
  const pickImage = async () => {
    // Ask for permission to access the photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to change your profile picture.');
      return;
    }

    // Open the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Forces a square crop perfect for avatars!
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'First Name and Last Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      // Because we are uploading an image file, we MUST use FormData instead of a standard JSON object
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone_number', phone);
      // We stringify the nested patient info for the backend to parse
      formData.append('patient_info', JSON.stringify({
        ...(user?.patient_info || {}),
        barangay: barangay
      }));

      // If the user selected a new image, attach it to the form
      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append('profile_picture', {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      // Send as multipart/form-data
      await apiClient.put('user/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await fetchUserFromDjango();
      Alert.alert('Success', 'Your profile has been updated!');
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#F8F9FA]">
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100 shadow-sm z-10 flex-row items-center">
        <Text className="text-xl font-bold text-gray-900">Personal Information</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        
        {/* Profile Picture Upload Section */}
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
            
            {/* Camera Icon Badge */}
            <View className="absolute bottom-0 right-0 bg-red-600 w-10 h-10 rounded-full border-4 border-white items-center justify-center shadow-sm">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-gray-400 text-xs mt-3 font-medium">Tap to change photo</Text>
        </View>

        <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
          {/* First Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">First Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={firstName} onChangeText={setFirstName} className="flex-1 text-gray-900 font-medium" placeholder="First Name" />
            </View>
          </View>

          {/* Last Name */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Last Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <User size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={lastName} onChangeText={setLastName} className="flex-1 text-gray-900 font-medium" placeholder="Last Name" />
            </View>
          </View>

          {/* Mobile Number */}
          <View className="mb-5">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" className="flex-1 text-gray-900 font-medium" placeholder="09XX-XXX-XXXX" />
            </View>
          </View>

          {/* Barangay */}
          <View className="mb-2">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1 uppercase tracking-wider">Barangay</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <MapPin size={20} color="#9CA3AF" className="mr-3" />
              <TextInput value={barangay} onChangeText={setBarangay} className="flex-1 text-gray-900 font-medium" placeholder="e.g. 171" />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} disabled={isSaving} className={`w-full rounded-2xl py-4 flex-row items-center justify-center shadow-sm ${isSaving ? 'bg-red-400' : 'bg-red-600'}`}>
          {isSaving ? <ActivityIndicator color="white" /> : <><Save size={20} color="white" className="mr-2" /><Text className="text-white font-bold text-lg">Save Changes</Text></>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}