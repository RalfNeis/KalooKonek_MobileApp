/// <reference types="nativewind/types" />
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Calendar, MapPin, Share2 } from 'lucide-react-native';

export default function AnnouncementDetails() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Colored Block */}
      <View className="bg-red-50 p-6 pt-10 border-b border-red-100">
        <View className="bg-red-100 self-start px-3 py-1 rounded-lg mb-4">
          <Text className="text-red-600 text-[10px] font-bold uppercase tracking-widest">Urgent Notice</Text>
        </View>
        <Text className="text-3xl font-black text-gray-900 mb-4 leading-tight">Free Medical Mission for Senior Citizens</Text>
        
        <View className="flex-row items-center gap-2 mb-2">
          <Calendar size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">October 25, 2025 • 8:00 AM</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">Barangay 172 Covered Court</Text>
        </View>
      </View>

      {/* Body Content */}
      <View className="p-6">
        <Text className="text-base text-gray-800 leading-relaxed mb-6">
          The Barangay Health Center, in partnership with the City Health Office, will be conducting free medical checkups, blood tests, and medicine distribution this coming weekend.
        </Text>
        
        <Text className="font-bold text-gray-900 text-lg mb-3">Requirements to Bring:</Text>
        <View className="bg-gray-50 rounded-2xl p-5 mb-8">
          <Text className="text-base text-gray-700 mb-2">• Official Senior Citizen ID</Text>
          <Text className="text-base text-gray-700 mb-2">• Health Record Booklet</Text>
          <Text className="text-base text-gray-700">• Empty medicine wrappers for refill</Text>
        </View>

        <TouchableOpacity className="flex-row items-center justify-center gap-3 w-full border border-gray-200 rounded-2xl py-4">
          <Share2 size={20} color="#374151" />
          <Text className="text-gray-800 font-bold text-base">Share with a Neighbor</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
