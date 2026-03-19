/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Camera, Calendar as CalendarIcon } from 'lucide-react-native';

export default function Settings() {
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Manage your profile, security, and preferences.
      </Text>

      {/* Profile Photo Card */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
        <Text className="font-bold text-gray-900 text-base mb-5">Profile Photo</Text>
        <View className="flex-row items-center">
          <View className="relative mr-6">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center">
               <Text className="text-3xl">🧑🏼‍🦳</Text>
            </View>
            <View className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
              <Camera size={14} color="#6B7280" />
            </View>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <TouchableOpacity className="border border-gray-200 rounded-xl px-4 py-2 mr-4">
                <Text className="text-gray-700 font-medium text-xs">Upload New</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-2 py-2">
                <Text className="text-red-500 font-medium text-xs">Remove</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-[10px] text-gray-400">Recommended: Square JPG, PNG, or GIF. Max 2MB.</Text>
          </View>
        </View>
      </View>

      {/* Personal Details Form */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
        <Text className="font-bold text-gray-900 text-base mb-5">Personal Details</Text>
        
        <View className="flex-row justify-between mb-4">
          <View className="w-[48%]">
            <Text className="text-gray-500 text-xs mb-1.5 ml-1">First Name</Text>
            <TextInput defaultValue="Raphael Nikko" className="w-full border border-gray-200 rounded-xl py-3 px-4 text-gray-900" />
          </View>
          <View className="w-[48%]">
            <Text className="text-gray-500 text-xs mb-1.5 ml-1">Last Name</Text>
            <TextInput defaultValue="Espiritu" className="w-full border border-gray-200 rounded-xl py-3 px-4 text-gray-900" />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1.5 ml-1">Date of Birth</Text>
          <View className="w-full border border-gray-200 rounded-xl py-3 px-4 flex-row justify-between items-center">
             <Text className="text-gray-900">1955-08-15</Text>
             <CalendarIcon size={18} color="#9CA3AF" />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 text-xs mb-1.5 ml-1">Barangay</Text>
          <TextInput defaultValue="Brgy. 172" className="w-full border border-gray-200 rounded-xl py-3 px-4 text-gray-900" />
        </View>

        <View className="flex-row justify-end items-center">
          <TouchableOpacity className="py-3 px-4 mr-4"><Text className="text-gray-500 font-medium">Cancel</Text></TouchableOpacity>
          <TouchableOpacity className="bg-red-600 py-3 px-6 rounded-xl"><Text className="text-white font-bold">Save Changes</Text></TouchableOpacity>
        </View>
      </View>

      {/* Language Preferences - Adjusted to fix Android height bug */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
        <Text className="font-bold text-gray-900 text-base mb-5">Language Preferences</Text>
        
        <TouchableOpacity className="border-2 border-red-500 bg-red-50 rounded-2xl p-4 flex-row items-center mb-4">
          <View className="w-5 h-5 rounded-full border-[5px] border-red-500 bg-white mr-4" />
          <View>
            <Text className="font-bold text-gray-900">English</Text>
            <Text className="text-xs text-gray-500">Default interface language.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="border border-gray-200 rounded-2xl p-4 flex-row items-center">
          <View className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white mr-4" />
          <View>
            <Text className="font-bold text-gray-900">Filipino</Text>
            <Text className="text-xs text-gray-500">I-translate ang interface sa Tagalog.</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
