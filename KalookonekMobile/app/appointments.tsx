/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react-native';

export default function Appointments() {
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Schedule your next visit to the Health Center.
      </Text>

      {/* Booking Form Card */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
        <Text className="font-bold text-gray-900 text-lg mb-6">Book New Appointment</Text>
        
        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-sm mb-2">Department</Text>
          <TouchableOpacity className="w-full bg-red-50 border border-red-100 rounded-xl py-4 px-4">
             <Text className="text-gray-900 text-base">General Medicine</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-sm mb-2">Preferred Date</Text>
          <TouchableOpacity className="w-full border border-gray-200 rounded-xl py-4 px-4 flex-row justify-between items-center">
             <Text className="text-gray-400 text-base">mm/dd/yyyy</Text>
             <CalendarIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 font-medium text-sm mb-2">Notes</Text>
          <TextInput 
            className="w-full border border-gray-200 rounded-xl py-4 px-4 text-gray-900 text-base min-h-[100px]"
            multiline
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity className="w-full bg-red-600 rounded-xl py-4 items-center shadow-sm">
          <Text className="text-white font-bold text-base">Submit Request</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Schedule */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Upcoming Schedule</Text>
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex-row items-center gap-5">
        <View className="bg-gray-50 rounded-2xl px-4 py-3 items-center justify-center border border-gray-100">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">DEC</Text>
          <Text className="text-2xl font-black text-gray-900 mt-1">20</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-base mb-1">Dental Checkup</Text>
          <Text className="text-xs text-gray-500 mb-2">Barangay Health Center, Room 2</Text>
          <Text className="text-xs font-bold text-red-600">9:00 AM - 10:00 AM</Text>
        </View>
        <TouchableOpacity className="p-3">
          <Trash2 size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}