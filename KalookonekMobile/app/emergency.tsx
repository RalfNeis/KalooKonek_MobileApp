/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Bell, ShieldAlert } from 'lucide-react-native';

export default function Emergency() {
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      
      {/* Massive SOS Button Wrapper */}
      <View className="items-center justify-center py-10 mt-4 mb-8">
        <TouchableOpacity 
          className="w-64 h-64 rounded-full bg-red-600 items-center justify-center shadow-lg shadow-red-500/50"
          activeOpacity={0.7}
        >
          <Bell size={64} color="white" className="mb-2" />
          <Text className="text-5xl font-black text-white tracking-widest mt-2">SOS</Text>
          <Text className="text-white/80 font-medium text-sm mt-3">Press for 3 Seconds</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 text-center text-sm mb-10 px-4 leading-relaxed">
        This will alert the Barangay Quick Response Team and your listed guardian immediately.
      </Text>

      {/* Quick Action Cards - Adjusted margins to fix Android height bug */}
      <View className="flex-row justify-between">
        <TouchableOpacity className="w-[48%] bg-white border border-gray-100 rounded-3xl p-5 shadow-sm items-center justify-center py-8">
          <View className="bg-red-50 p-4 rounded-2xl mb-3">
            <Bell size={28} color="#DC2626" /> 
          </View>
          <View className="items-center">
            <Text className="font-bold text-gray-900 text-base text-center mb-1">Ambulance</Text>
            <Text className="text-xs text-gray-500 text-center">Tap to Call</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="w-[48%] bg-white border border-gray-100 rounded-3xl p-5 shadow-sm items-center justify-center py-8">
          <View className="bg-blue-50 p-4 rounded-2xl mb-3">
            <ShieldAlert size={28} color="#2563EB" />
          </View>
          <View className="items-center">
            <Text className="font-bold text-gray-900 text-base text-center mb-1">Barangay Security</Text>
            <Text className="text-xs text-gray-500 text-center">Tap to Call</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
