/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Phone, Mail } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Register() {
  const router = useRouter();
  
  // State variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // NEW: Gender State
  const [dob, setDob] = useState('');
  const [barangay, setBarangay] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // DatePicker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // --- NEW: Auto-Format Date Typing ---
  const handleTextDobChange = (text: string) => {
    // Remove everything that isn't a number
    let cleaned = text.replace(/[^0-9]/g, '');
    
    // Auto-add slashes (MM/DD/YYYY)
    if (cleaned.length >= 3 && cleaned.length <= 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    
    setDob(cleaned);
  };

  // --- NEW: Handle Calendar Selection ---
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Hide picker immediately after selection
    setShowDatePicker(Platform.OS === 'ios'); 
    
    if (event.type === 'set' && selectedDate) {
      setShowDatePicker(false);
      setDate(selectedDate);
      
      // Format to MM/DD/YYYY
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      setDob(`${month}/${day}/${year}`);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleRegister = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password || !gender) {
      Alert.alert('Error', 'Please fill in all required fields including Gender.');
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          gender: gender, // Attached to Supabase!
          dob: dob,
          barangay: barangay,
          mobile: mobile,
        }
      }
    });

    if (error) {
      Alert.alert('Registration Failed', error.message);
      setIsLoading(false);
    } else {
      Alert.alert('Success!', 'Account created successfully. You can now sign in.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      
      {/* Top Bar Navigation */}
      <View className="px-6 pt-16 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">KalooKonek</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* White Form Card */}
        <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-8 pb-10 shadow-xl mt-4">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-gray-500 text-sm mb-6">Enter your details to register.</Text>

          <View className="flex-row justify-between mb-4">
            <View className="w-[48%]">
              <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">First Name</Text>
              <TextInput 
                value={firstName} onChangeText={setFirstName}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-gray-900" 
              />
            </View>
            <View className="w-[48%]">
              <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Last Name</Text>
              <TextInput 
                value={lastName} onChangeText={setLastName}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-gray-900" 
              />
            </View>
          </View>

          {/* NEW: Gender Selection */}
          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Gender</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity 
                onPress={() => setGender('Male')}
                className={`flex-1 h-14 rounded-2xl border flex-row items-center justify-center transition-all ${gender === 'Male' ? 'bg-red-50 border-red-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={`font-bold ${gender === 'Male' ? 'text-red-600' : 'text-gray-500'}`}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setGender('Female')}
                className={`flex-1 h-14 rounded-2xl border flex-row items-center justify-center transition-all ${gender === 'Female' ? 'bg-red-50 border-red-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={`font-bold ${gender === 'Female' ? 'text-red-600' : 'text-gray-500'}`}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* UPDATED: Date of Birth with Auto-format and Calendar Button */}
          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Date of Birth</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <TextInput 
                value={dob} 
                onChangeText={handleTextDobChange} // Using our new formatting function
                maxLength={10} // Prevents typing past MM/DD/YYYY
                keyboardType="numeric"
                className="flex-1 text-gray-900" 
                placeholder="MM/DD/YYYY" 
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} className="p-2 -mr-2">
                <Calendar size={22} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Native DatePicker Component (Invisible until triggered) */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()} // Prevents selecting future dates
            />
          )}

          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Barangay</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <TextInput 
                value={barangay} onChangeText={setBarangay}
                className="flex-1 text-gray-900" placeholder="e.g. Brgy. 171" 
              />
              <MapPin size={20} color="#9CA3AF" />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={mobile} onChangeText={setMobile}
                className="flex-1 text-gray-900" placeholder="09XX-XXX-XXXX" keyboardType="phone-pad" 
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Mail size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={email} onChangeText={setEmail}
                autoCapitalize="none" keyboardType="email-address"
                className="flex-1 text-gray-900" placeholder="citizen@kalookonek.com" 
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Password</Text>
            <TextInput 
              value={password} onChangeText={setPassword}
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-gray-900" 
              placeholder="••••••••" secureTextEntry 
            />
          </View>

          <TouchableOpacity 
            onPress={handleRegister} 
            disabled={isLoading}
            className={`w-full rounded-2xl py-4 items-center shadow-sm mb-6 ${isLoading ? 'bg-red-400' : 'bg-red-600'}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center gap-1 mb-10">
            <Text className="text-gray-500 text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-red-600 font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}