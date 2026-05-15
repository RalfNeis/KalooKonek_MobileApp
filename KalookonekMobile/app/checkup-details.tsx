/// <reference types="nativewind/types" />
import { ScrollView, View } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { User, FileText } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CheckupDetails() {
  // 1. Grab the dynamic data passed from the Health Records list!
  const params = useLocalSearchParams();
  
  const visitDate = params.visit_date || 'Unknown Date';
  const status = params.status || 'Pending';
  const diagnosis = params.diagnosis || 'General Checkup';
  const doctor = params.attending_staff || 'Assigned Physician';
  const bp = params.blood_pressure || '--';
  const temp = params.temperature || '--';
  const weight = params.weight || '--';
  const notes = params.notes || 'No additional notes provided.';

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      
      {/* Top Header info */}
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 mt-2">
        <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
           <Text className="font-bold text-gray-900 text-lg">{visitDate}</Text>
           <View className="bg-emerald-50 px-3 py-1 rounded-lg">
             <Text className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{status}</Text>
           </View>
        </View>

        <Text className="text-sm text-gray-500 mb-1">Purpose of Visit / Diagnosis</Text>
        <Text className="text-xl font-bold text-gray-900 mb-4">{diagnosis}</Text>
        
        <View className="flex-row items-center gap-3">
          <View className="bg-blue-50 p-3 rounded-full"><User size={20} color="#3B82F6" /></View>
          <View>
            <Text className="text-sm font-bold text-gray-900">{doctor}</Text>
            <Text className="text-xs text-gray-500">Attending Staff</Text>
          </View>
        </View>
      </View>

      {/* Vitals Recorded */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Vitals Recorded</Text>
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-4">
          <Text className="text-xs text-gray-500 mb-1">Blood Pressure</Text>
          <Text className="text-lg font-bold text-gray-900">{bp} <Text className="text-sm font-normal text-gray-500">mmHg</Text></Text>
        </View>
        <View className="w-[48%] mb-4">
          <Text className="text-xs text-gray-500 mb-1">Temperature</Text>
          <Text className="text-lg font-bold text-gray-900">{temp} <Text className="text-sm font-normal text-gray-500">°C</Text></Text>
        </View>
        <View className="w-[48%]">
          <Text className="text-xs text-gray-500 mb-1">Weight</Text>
          <Text className="text-lg font-bold text-gray-900">{weight} <Text className="text-sm font-normal text-gray-500">kg</Text></Text>
        </View>
      </View>

      {/* Doctor's Notes */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Doctor's Notes</Text>
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
        <View className="flex-row gap-3">
          <FileText size={20} color="#DC2626" className="mt-1" />
          <Text className="flex-1 text-base text-gray-700 leading-relaxed">
            {notes}
          </Text>
        </View>
      </View>

      <View className="h-10" />
    </ScrollView>
  );
}