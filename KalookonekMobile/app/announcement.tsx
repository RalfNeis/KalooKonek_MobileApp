/// <reference types="nativewind/types" />
import { ScrollView, View } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Calendar, Info } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AnnouncementDetails() {
  // 1. Grab the specific data passed from the List screen!
  const { title, date, body } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Colored Block */}
      <View className="bg-red-50 p-6 pt-10 border-b border-red-100">
        <View className="bg-red-100 self-start px-3 py-1 rounded-lg mb-4">
          <Text className="text-red-600 text-[10px] font-bold uppercase tracking-widest">Barangay Update</Text>
        </View>
        
        {/* 2. Inject the dynamic Title */}
        <Text className="text-3xl font-black text-gray-900 mb-4 leading-tight">
          {title || 'Announcement Details'}
        </Text>
        
        <View className="flex-row items-center gap-2 mb-2">
          <Calendar size={16} color="#6B7280" />
          {/* 3. Inject the dynamic Date */}
          <Text className="text-sm text-gray-600">{date || 'Recent'}</Text>
        </View>
        
        <View className="flex-row items-center gap-2">
          <Info size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">Caloocan City</Text>
        </View>
      </View>

      {/* Body Content */}
      <View className="p-6">
        {/* 4. Inject the dynamic Body Text */}
        <Text className="text-base text-gray-800 leading-relaxed mb-8">
          {body || 'No additional details provided for this announcement.'}
        </Text>
      </View>
    </ScrollView>
  );
}