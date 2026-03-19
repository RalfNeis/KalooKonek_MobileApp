/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, ArrowRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react-native';

export default function Medicine() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-4">
      <Text className="text-gray-500 text-sm mb-6">Manage your maintenance medicine and requests.</Text>

      {/* Available Medicine */}
      <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="bg-blue-50 p-3 rounded-xl"><Pill color="#3B82F6" size={24} /></View>
          <View className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
            <Text className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Available</Text>
          </View>
        </View>
        <Text className="font-bold text-gray-900 text-lg">Biogesic</Text>
        <Text className="text-sm text-red-600 font-bold mb-4">10 mg</Text>
        
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <ArrowRight size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500">Once a day (Morning)</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <CalendarIcon size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500">Next Refill: Dec 20, 2025</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push('/refill')}
          className="border border-gray-200 rounded-xl py-4 items-center"
        >
          <Text className="text-gray-700 font-bold text-base">Request Refill</Text>
        </TouchableOpacity>
      </View>

      {/* Low Stock Medicine */}
      <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <View className="flex-row justify-between items-start mb-4">
          <View className="bg-blue-50 p-3 rounded-xl"><Pill color="#3B82F6" size={24} /></View>
          <View className="bg-amber-50 border border-amber-100 px-3 py-1 rounded-lg">
            <Text className="text-amber-600 text-[10px] font-bold uppercase tracking-wider">Low Stock</Text>
          </View>
        </View>
        <Text className="font-bold text-gray-900 text-lg">Paracetamol</Text>
        <Text className="text-sm text-red-600 font-bold mb-4">500 mg</Text>
        
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <ArrowRight size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500">Twice a day (After meals)</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AlertCircle size={12} color="#D97706" />
            <Text className="text-xs text-amber-600 font-medium">Refill Needed Soon</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push('/refill')}
          className="bg-red-600 rounded-xl py-4 items-center shadow-sm"
        >
          <Text className="text-white font-bold text-base">Request Refill Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}