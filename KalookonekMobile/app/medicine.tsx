/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, ArrowRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore'; // Adjust path if needed

export default function Medicine() {
  const router = useRouter();
  
  // Pull the dashboard data from the store
  const { dashboard } = useUserStore();
  
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-4">
      <Text className="text-gray-500 text-sm mb-6">Manage your maintenance medicine and requests.</Text>

      {/* Dynamic Medicine List */}
      {!dashboard?.medicines || dashboard.medicines.length === 0 ? (
        <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 items-center justify-center mt-4">
          <Text className="text-gray-400 italic">-- No maintenance medicines on file --</Text>
        </View>
      ) : (
        dashboard.medicines.map((med: any, index: number) => (
          <View key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            {/* Template ready for when backend supplies medicine data */}
            <Text className="font-bold text-gray-900 text-lg">{med.name}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}