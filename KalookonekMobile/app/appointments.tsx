/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';

export default function Appointments() {
  const { dashboard, fetchDashboardFromDjango } = useUserStore();

  // Form State
  const [department, setDepartment] = useState('General Medicine');
  const [date, setDate] = useState(''); // Stores the formatted YYYY-MM-DD string for Django
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DatePicker State
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Handle native date picker selection
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, we need to hide the picker immediately after a selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDateObj(selectedDate);
      
      // Format the date exactly how Django expects it: YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
    }
  };

  const handleBookAppointment = async () => {
    if (!department || !date) {
      Alert.alert('Missing Details', 'Please enter a department and select a preferred date.');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('appointments/', {
        department: department,
        preferred_date: date,
        notes: notes,
      });

      Alert.alert('Success', 'Your appointment request has been sent!', [
        { 
          text: 'OK', 
          onPress: async () => {
            // Reset form
            setDate('');
            setNotes('');
            setDateObj(new Date());
            await fetchDashboardFromDjango();
          } 
        }
      ]);
      
    } catch (error: any) {
      console.error("Booking error:", error);
      Alert.alert('Error', 'Failed to send your request. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Schedule your next visit to the Health Center.
      </Text>

      {/* Booking Form Card */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
        <Text className="font-bold text-gray-900 text-lg mb-6">Book New Appointment</Text>
        
        {/* Department Field */}
        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-sm mb-2">Department</Text>
          <View className="w-full bg-red-50 border border-red-100 rounded-xl py-2 px-4 justify-center h-14">
             <TextInput 
                value={department}
                onChangeText={setDepartment}
                className="text-gray-900 text-base font-medium"
             />
          </View>
        </View>

        {/* INTERACTIVE DATE FIELD */}
        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-sm mb-2">Preferred Date</Text>
          <TouchableOpacity 
            onPress={() => setShowPicker(true)}
            className="w-full border border-gray-200 rounded-xl py-2 px-4 flex-row justify-between items-center h-14"
          >
             <Text className={`flex-1 text-base ${date ? 'text-gray-900' : 'text-gray-400'}`}>
               {date || 'Tap to select date'}
             </Text>
             <CalendarIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* The Native DatePicker Modal */}
        {showPicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()} // Prevents selecting past dates!
          />
        )}

        {/* Notes Field */}
        <View className="mb-6">
          <Text className="text-gray-600 font-medium text-sm mb-2">Notes</Text>
          <TextInput 
            value={notes}
            onChangeText={setNotes}
            className="w-full border border-gray-200 rounded-xl py-4 px-4 text-gray-900 text-base min-h-[100px]"
            multiline
            placeholder="Type any concerns here..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleBookAppointment}
          disabled={isSubmitting}
          className={`w-full rounded-xl py-4 items-center shadow-sm ${isSubmitting ? 'bg-red-400' : 'bg-red-600'}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Upcoming Schedule */}
      <Text className="font-bold text-gray-900 text-lg mb-4">Upcoming Schedule</Text>
      
      {!dashboard?.upcoming_appointments || dashboard.upcoming_appointments.length === 0 ? (
        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 items-center justify-center">
          <Text className="text-gray-400 italic">-- No upcoming appointments --</Text>
        </View>
      ) : (
        dashboard.upcoming_appointments.map((appt: any, index: number) => (
          <View key={index} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-3 flex-row items-center justify-between">
             <View>
               <Text className="font-bold text-gray-900">{appt.details || appt.department}</Text>
               <Text className="text-sm text-gray-500 mt-1">{appt.date}</Text>
             </View>
             <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
               <Text className="text-amber-600 text-xs font-bold">{appt.status || 'Pending'}</Text>
             </View>
          </View>
        ))
      )}
      
      <View className="h-10" />
    </ScrollView>
  );
}