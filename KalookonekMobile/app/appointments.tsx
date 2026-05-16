/// <reference types="nativewind/types" />
import React, { useState, useCallback } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';

export default function Appointments() {
  const { dashboard, fetchDashboardFromDjango, isLoading } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboardFromDjango();
    setIsRefreshing(false);
  }, [fetchDashboardFromDjango]);

  // Form State - Completely changed and blank by default!
  const [appointmentName, setAppointmentName] = useState(''); 
  const [date, setDate] = useState(''); 
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DatePicker State
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Handle native date picker selection
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDateObj(selectedDate);
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
    }
  };

  const handleBookAppointment = async () => {
    if (!appointmentName || !date) {
      Alert.alert('Missing Details', 'Please enter the name of the appointment and select a preferred date.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine the name and notes to match Django's "reason" field requirement
      const combinedReason = notes.trim() ? `${appointmentName}\n\nAdditional Notes: ${notes}` : appointmentName;

      // Sending EXACTLY what user/views.py demands
      await apiClient.post('appointments/', {
        requested_date: date,
        reason: combinedReason,
      });

      Alert.alert('Success', 'Your appointment request has been sent!', [
        { 
          text: 'OK', 
          onPress: async () => {
            // Reset form
            setAppointmentName('');
            setDate('');
            setNotes('');
            setDateObj(new Date());
            await fetchDashboardFromDjango();
          } 
        }
      ]);
      
    } catch (error: any) {
      console.error("Booking error:", error?.response?.data || error);
      const serverMsg = error?.response?.data?.error;
      if (error?.response?.status === 403) {
        Alert.alert('Account Pending', serverMsg || 'Your account is still pending approval by an administrator.');
      } else if (error?.response?.status === 404) {
        Alert.alert('Profile Missing', serverMsg || 'No patient profile found. Please contact support.');
      } else {
        Alert.alert('Error', serverMsg || 'Failed to send your request. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-[#F8F9FA] p-5"
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={handleRefresh} 
          colors={['#DC2626']} 
          tintColor="#DC2626" 
        />
      }
    >
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Schedule your next visit to the Health Center.
      </Text>

      {/* Booking Form Card */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
        <Text className="font-bold text-gray-900 text-lg mb-6">Book New Appointment</Text>
        
        {/* Name of Appointment Field (REPLACED DEPARTMENT) */}
        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-sm mb-2">Name of Appointment</Text>
          <View className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 justify-center min-h-[56px]">
             <TextInput 
                value={appointmentName}
                onChangeText={setAppointmentName}
                placeholder="e.g., General Checkup, Blood test..."
                placeholderTextColor="#9CA3AF"
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
            minimumDate={new Date()} 
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
             <View className="flex-1 mr-4">
               <Text className="font-bold text-gray-900">{appt.details || appt.reason || appt.department}</Text>
               <Text className="text-sm text-gray-500 mt-1">{appt.date || appt.requested_date}</Text>
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