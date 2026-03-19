/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { User, Activity, FileText, Download } from 'lucide-react-native';

export default function CheckupDetails() {
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      
      {/* Top Header info */}
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 mt-2">
        <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
           <Text className="font-bold text-gray-900 text-lg">Oct 15, 2025</Text>
           <View className="bg-emerald-50 px-3 py-1 rounded-lg">
             <Text className="text-emerald-600 text-xs font-bold">Completed</Text>
           </View>
        </View>

        <Text className="text-sm text-gray-500 mb-1">Purpose of Visit</Text>
        <Text className="text-xl font-bold text-gray-900 mb-4">Annual Physical Exam</Text>
        
        <View className="flex-row items-center gap-3">
          <View className="bg-blue-50 p-3 rounded-full"><User size={20} color="#3B82F6" /></View>
          <View>
            <Text className="text-sm font-bold text-gray-900">Dr. Sarah Gomez</Text>
            <Text className="text-xs text-gray-500">General Physician</Text>
          </View>
        </View>
      </View>

      {/* Vitals Recorded */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Vitals Recorded</Text>
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-4">
          <Text className="text-xs text-gray-500 mb-1">Blood Pressure</Text>
          <Text className="text-lg font-bold text-gray-900">120/80 <Text className="text-sm font-normal text-gray-500">mmHg</Text></Text>
        </View>
        <View className="w-[48%] mb-4">
          <Text className="text-xs text-gray-500 mb-1">Heart Rate</Text>
          <Text className="text-lg font-bold text-gray-900">72 <Text className="text-sm font-normal text-gray-500">bpm</Text></Text>
        </View>
        <View className="w-[48%]">
          <Text className="text-xs text-gray-500 mb-1">Weight</Text>
          <Text className="text-lg font-bold text-gray-900">65 <Text className="text-sm font-normal text-gray-500">kg</Text></Text>
        </View>
      </View>

      {/* Doctor's Notes */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Doctor's Notes</Text>
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
        <View className="flex-row gap-3">
          <FileText size={20} color="#DC2626" className="mt-1" />
          <Text className="flex-1 text-base text-gray-700 leading-relaxed">
            Patient is in good health condition. Vitals are normal. Advised to continue current maintenance for blood pressure and maintain a low-sodium diet.
          </Text>
        </View>
      </View>

      <TouchableOpacity className="w-full bg-red-600 rounded-2xl py-4 flex-row justify-center items-center gap-2 shadow-sm mb-10">
        <Download size={20} color="white" />
        <Text className="text-white font-bold text-base">Download Certificate</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
