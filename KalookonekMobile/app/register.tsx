/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiClient } from '../api/client';


export default function Register() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  
  // Barangay state now only holds the selected number (100-110)
  const [barangay, setBarangay] = useState('');
  const [showBrgyDropdown, setShowBrgyDropdown] = useState(false);
  const brgyList = ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110'];
  
  const [mobile, setMobile] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleTextDobChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 3 && cleaned.length <= 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    setDob(cleaned);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    
    if (event.type === 'set' && selectedDate) {
      setShowDatePicker(false);
      setDate(selectedDate);
      
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      setDob(`${month}/${day}/${year}`);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !gender || !barangay || !dob) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (mobile.length !== 9) {
      Alert.alert('Invalid Mobile Number', 'Please complete the 11-digit mobile number.');
      return;
    }

    // Combine prefixes before sending to Django
    const fullMobileNumber = `09${mobile}`;
    const fullBarangay = `Brgy. ${barangay}`;

    setIsLoading(true);

    try {
      const response = await apiClient.post('accounts/create/', {
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        password: password, 
        gender: gender,
        dob: dob,
        barangay: fullBarangay, // Sends exactly "Brgy. 105"
        phone_number: fullMobileNumber, 
      });

      Alert.alert('Request Sent!', 'Your registration request has been sent to the Barangay Staff for approval.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);

    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit registration request.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-red-600">
      
      <View className="px-6 pt-16 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">KalooKonek</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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

          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Date of Birth</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <TextInput 
                value={dob} 
                onChangeText={handleTextDobChange}
                maxLength={10} 
                keyboardType="numeric"
                className="flex-1 text-gray-900" 
                placeholder="MM/DD/YYYY" 
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} className="p-2 -mr-2">
                <Calendar size={22} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Custom Barangay Dropdown Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Barangay</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowBrgyDropdown(true)}
              className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14"
            >
              <MapPin size={20} color="#9CA3AF" className="mr-3" />
              <Text className="text-gray-900 text-base mr-1 tracking-widest mt-[2px]">Brgy.</Text>
              <Text className={`flex-1 text-base tracking-widest mt-[2px] ${barangay ? 'text-gray-900' : 'text-gray-400'}`}>
                {barangay || "Select Number"}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Bug-Free Modal Dropdown */}
          <Modal visible={showBrgyDropdown} transparent={true} animationType="fade">
            <TouchableOpacity 
              className="flex-1 justify-center items-center bg-black/40"
              activeOpacity={1} 
              onPress={() => setShowBrgyDropdown(false)} // Closes if they tap outside the box
            >
              <View className="bg-white rounded-3xl w-4/5 max-h-96 overflow-hidden shadow-xl">
                {/* Modal Header */}
                <View className="bg-gray-50 py-4 items-center border-b border-gray-100">
                  <Text className="text-gray-900 font-bold text-lg">Select Barangay</Text>
                </View>
                
                {/* Scrollable List */}
                <ScrollView className="w-full">
                  {brgyList.map((num, index) => (
                    <TouchableOpacity 
                      key={num}
                      className={`py-4 items-center ${index !== brgyList.length - 1 ? 'border-b border-gray-100' : ''}`}
                      onPress={() => {
                        setBarangay(num);
                        setShowBrgyDropdown(false);
                      }}
                    >
                      <Text className="text-gray-900 font-medium text-lg">Brgy. {num}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          <View className="mb-4">
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Phone size={20} color="#9CA3AF" className="mr-3" />
              <Text className="text-gray-900 text-base tracking-widest mt-[2px]">09</Text>
              <TextInput 
                value={mobile} 
                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))} 
                maxLength={9} 
                className="flex-1 text-gray-900 text-base tracking-widest p-0 ml-1" 
                placeholder="XXXXXXXXX" 
                keyboardType="numeric" 
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