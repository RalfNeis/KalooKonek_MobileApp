/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, CheckCircle, MapPin } from 'lucide-react-native';

export default function RefillRequest() {
  const router = useRouter();

  const handleSubmit = () => {
    Alert.alert(
      "Request Submitted", 
      "Your medicine refill request has been sent to the Barangay Health Center.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Verify your medicine details and choose a pickup location to request a refill.
      </Text>

      {/* Selected Medicine */}
      <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="bg-blue-50 p-4 rounded-2xl"><Pill size={28} color="#3B82F6" /></View>
          <View>
            <Text className="font-bold text-gray-900 text-xl">Paracetamol</Text>
            <Text className="text-red-600 font-bold text-base">500 mg</Text>
          </View>
        </View>
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-sm text-gray-600 mb-1">Prescribed Quantity: <Text className="font-bold text-gray-900">30 tablets</Text></Text>
          <Text className="text-sm text-gray-600">Instructions: <Text className="font-bold text-gray-900">Twice a day</Text></Text>
        </View>
      </View>

      {/* Pickup Options */}
      <Text className="font-bold text-gray-900 text-lg mb-4 mt-2">Pickup Location</Text>
      
      <TouchableOpacity className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 mb-4 flex-row items-center gap-4">
        <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center">
          <CheckCircle size={14} color="white" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-base mb-1">Barangay Health Center</Text>
          <Text className="text-xs text-gray-500">Pick up at the counter starting tomorrow morning.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="bg-white border-2 border-transparent border-gray-100 rounded-3xl p-5 mb-8 flex-row items-center gap-4">
        <View className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-base mb-1">Home Delivery (PWD/Bedridden)</Text>
          <Text className="text-xs text-gray-500">Barangay staff will deliver it within 2-3 days.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSubmit}
        className="w-full bg-red-600 rounded-2xl py-5 items-center shadow-sm mb-10"
      >
        <Text className="text-white font-bold text-base">Confirm Refill Request</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}