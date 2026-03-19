/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Activity, Scale, Download } from 'lucide-react-native';

const USER_DATA = { bp: "120/80", sugar: "95 mg/dL", weight: "65 kg" };

export default function HealthRecords() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-4">
      <Text className="text-gray-500 text-sm mb-6">View your medical history and vital signs.</Text>
      
      {/* Vitals Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <View className="w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm items-center mb-4">
          <Heart color="#3B82F6" size={24} className="mb-2" />
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Pressure</Text>
          <Text className="text-2xl font-bold text-gray-900">{USER_DATA.bp}</Text>
          <View className="mt-2 bg-blue-50 px-2 py-0.5 rounded"><Text className="text-blue-600 text-[10px] font-bold">Normal</Text></View>
        </View>

        <View className="w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm items-center mb-4">
          <Activity color="#EF4444" size={24} className="mb-2" />
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Sugar</Text>
          <Text className="text-2xl font-bold text-gray-900">{USER_DATA.sugar}</Text>
          <View className="mt-2 bg-emerald-50 px-2 py-0.5 rounded"><Text className="text-emerald-600 text-[10px] font-bold">Healthy</Text></View>
        </View>

        <View className="w-[100%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Scale color="#F59E0B" size={24} />
            <View>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weight</Text>
              <Text className="text-2xl font-bold text-gray-900">{USER_DATA.weight}</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-[10px]">Last checked: Oct 15</Text>
        </View>
      </View>

      {/* Recent Checkups Table (Converted to Flex List) */}
      <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <View className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex-row justify-between items-center">
          <Text className="font-bold text-gray-900">Recent Checkups</Text>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Download size={14} color="#EF4444" />
            <Text className="text-xs font-bold text-red-600">Report</Text>
          </TouchableOpacity>
        </View>
        
        {/* Row 1 */}
        <View className="p-5 border-b border-gray-100">
          <View className="flex-row justify-between mb-1">
            <Text className="font-bold text-gray-900">Oct 15, 2025</Text>
            <TouchableOpacity onPress={() => router.push('/checkup-details')}>
              <Text className="text-blue-600 font-bold text-xs py-1 px-2 -mr-2">View Details</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600">Dr. Sarah Gomez</Text>
          <Text className="text-xs text-gray-500 mt-1">Annual Physical Exam</Text>
        </View>

        {/* Row 2 */}
        <View className="p-5">
          <View className="flex-row justify-between mb-1">
            <Text className="font-bold text-gray-900">Aug 02, 2025</Text>
            <TouchableOpacity onPress={() => router.push('/checkup-details')}>
              <Text className="text-blue-600 font-bold text-xs py-1 px-2 -mr-2">View Details</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600">Dr. Reyes</Text>
          <Text className="text-xs text-gray-500 mt-1">Dental Cleaning</Text>
        </View>
      </View>
    </ScrollView>
  );
}
