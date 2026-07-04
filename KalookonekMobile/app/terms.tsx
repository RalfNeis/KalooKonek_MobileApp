/// <reference types="nativewind/types" />
import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';

export default function TermsOfService() {
  const router = useRouter();
  const { textScale } = useUserStore();

  const baseSize = 16 * textScale;
  const headerSize = 22 * textScale;

  return (
    <View className="flex-1 bg-red-600">
      <View className="px-6 pt-16 pb-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">KalooKonek</Text>
      </View>

      <View className="flex-1 bg-[#F8F9FA] rounded-t-[40px] shadow-xl overflow-hidden">
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          
          <View className="items-center mb-8">
            <View className="bg-red-50 p-4 rounded-full mb-4">
              <ShieldCheck size={40} color="#DC2626" />
            </View>
            <Text className="font-bold text-gray-900 text-center" style={{ fontSize: 26 * textScale }}>Terms of Service</Text>
            <Text className="text-gray-500 mt-2 text-center" style={{ fontSize: baseSize }}>Effective Date: July 2026</Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            
            <Text className="font-bold text-gray-900 mb-2" style={{ fontSize: headerSize }}>1. Introduction</Text>
            <Text className="text-gray-700 mb-6 leading-relaxed" style={{ fontSize: baseSize }}>
              Welcome to KalooKonek, the official identification and barangay portal system designed exclusively for the senior citizens of Caloocan City. By registering, accessing, or using our mobile application, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the application.
            </Text>

            <Text className="font-bold text-gray-900 mb-2" style={{ fontSize: headerSize }}>2. Data Privacy & RA 10173</Text>
            <Text className="text-gray-700 mb-6 leading-relaxed" style={{ fontSize: baseSize }}>
              Your privacy is our utmost priority. KalooKonek strictly complies with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173). 
              {'\n\n'}
              To provide essential barangay services, this application collects, processes, and safely stores your personal information, medical details, and verification data. This information is utilized solely to generate your dynamic OSCA ID QR code and to facilitate your health and barangay records. We will never sell or share your personal data with unauthorized third parties.
            </Text>

            <Text className="font-bold text-gray-900 mb-2" style={{ fontSize: headerSize }}>3. Account Security & OTPs</Text>
            <Text className="text-gray-700 mb-6 leading-relaxed" style={{ fontSize: baseSize }}>
              You are entirely responsible for safeguarding your account credentials. KalooKonek uses secure One-Time Passwords (OTPs) sent to your registered email or mobile device to verify your identity during critical actions (e.g., registration, password resets). 
              {'\n\n'}
              You must never share your OTPs, passwords, or device access with anyone. The barangay and KalooKonek staff will never ask for your password or OTP.
            </Text>

            <Text className="font-bold text-gray-900 mb-2" style={{ fontSize: headerSize }}>4. Service Limitations</Text>
            <Text className="text-gray-700 mb-6 leading-relaxed" style={{ fontSize: baseSize }}>
              KalooKonek is designed to digitally assist and expedite your access to Caloocan City barangay services. However, the app relies on an active internet connection to synchronize your records and generate valid QR codes.
              {'\n\n'}
              The accuracy of your medical and personal records depends entirely on the correct input of information during registration and updates. KalooKonek and the City of Caloocan are not liable for any service delays or medical complications arising from inaccurate data entry or loss of internet connectivity.
            </Text>

            <Text className="font-bold text-gray-900 mb-2" style={{ fontSize: headerSize }}>5. Modifications to the Service</Text>
            <Text className="text-gray-700 mb-2 leading-relaxed" style={{ fontSize: baseSize }}>
              We reserve the right to modify, suspend, or discontinue any part of the KalooKonek service at any time to implement security updates or feature enhancements. We will notify users of any significant changes to these Terms of Service.
            </Text>

          </View>
        </ScrollView>
      </View>
    </View>
  );
}
