/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore'; // Adjust path if needed

export default function Appointments() {
  
  // Pull the dashboard data from the store
  const { dashboard } = useUserStore();

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Schedule your next visit to the Health Center.
      </Text>

      {/* Booking Form Card (Kept intact for user input) */}
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

      {/* Upcoming Schedule (Dynamically Mapped) */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Upcoming Schedule</Text>
      
      {!dashboard?.upcoming_appointments || dashboard.upcoming_appointments.length === 0 ? (
        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 items-center justify-center">
          <Text className="text-gray-400 italic">-- No upcoming appointments --</Text>
        </View>
      ) : (
        dashboard.upcoming_appointments.map((appt: any, index: number) => (
          <View key={index} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex-row items-center gap-5 mb-3">
             <Text className="font-bold text-gray-900">{appt.details}</Text>
          </View>
        ))
      )}
      
      <View className="h-10" />
    </ScrollView>
  );
}