/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Phone, Mail } from 'lucide-react-native';
import { supabase } from '../lib/supabase'; // <-- Import Supabase

export default function Register() {
  const router = useRouter();
  
  // State variables to capture user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [barangay, setBarangay] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Email, Password).');
      return;
    }

    setIsLoading(true);

    // Tell Supabase to create the new account
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          // This safely attaches their extra info into Supabase's user metadata
          first_name: firstName,
          last_name: lastName,
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
      // Success! Route them back to the login screen to sign in
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
          <Text className="text-gray-500 text-sm mb-8">Enter your details to register.</Text>

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
            <Text className="text-gray-700 font-bold text-xs mb-2 ml-1">Date of Birth</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <TextInput 
                value={dob} onChangeText={setDob}
                className="flex-1 text-gray-900" placeholder="mm/dd/yyyy" 
              />
              <Calendar size={20} color="#9CA3AF" />
            </View>
          </View>

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

          {/* NEW EMAIL FIELD */}
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

          <View className="flex-row justify-center items-center gap-1">
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