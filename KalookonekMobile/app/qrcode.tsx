/// <reference types="nativewind/types" />
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ShieldAlert, Download, ShieldCheck, Clock } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';

// --- NEW IMPORTS ---
import { useKeepAwake } from 'expo-keep-awake';
import * as Brightness from 'expo-brightness';

export default function QRCodeScreen() {
  const { user } = useUserStore();

  // 1. Prevent the screen from going to sleep while this component is open!
  useKeepAwake();

  const [qrMode, setQrMode] = useState<'basic' | 'secure'>('basic');
  const [timeLeft, setTimeLeft] = useState(300);
  const [secureSessionId, setSecureSessionId] = useState(Date.now().toString());
  
  // State to remember the user's original screen brightness
  const [originalBrightness, setOriginalBrightness] = useState<number | null>(null);

  // 2. Handle Auto-Brightness when the component mounts
  useEffect(() => {
    let isMounted = true;

    const setupBrightness = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          // Save their current brightness so we can restore it later
          const current = await Brightness.getBrightnessAsync();
          if (isMounted) setOriginalBrightness(current);
          
          // Push brightness to 100% for the scanner!
          await Brightness.setBrightnessAsync(1.0);
        }
      } catch (error) {
        console.log("Brightness adjustment not supported on this device/simulator.");
      }
    };

    setupBrightness();

    // 3. CLEANUP: Restore original brightness when they leave the tab!
    return () => {
      isMounted = false;
      const restoreBrightness = async () => {
        if (originalBrightness !== null) {
          try {
            await Brightness.setBrightnessAsync(originalBrightness);
          } catch (e) {
             // Ignore errors on unmount
          }
        }
      };
      restoreBrightness();
    };
  }, [originalBrightness]);

  // Handle the countdown timer for Secure Mode
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (qrMode === 'secure') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setSecureSessionId(Date.now().toString());
            return 300; 
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(300);
    }

    return () => clearInterval(timer);
  }, [qrMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
        <Text className="text-gray-500">Loading Digital ID...</Text>
      </View>
    );
  }

  // The Basic payload is permanent
  const basicPayload = JSON.stringify({
    type: 'BASIC_ID',
    id: user.display_id || user.osca_id,
    name: `${user.first_name} ${user.last_name}`,
  });

  // The Secure payload attaches a timestamp and sensitive data
  // (NOTE: See Part 2 below on how backend devs will replace this with a JWT)
  const securePayload = JSON.stringify({
    type: 'SECURE_MEDICAL',
    id: user.display_id || user.osca_id,
    session_id: secureSessionId,
    data: {
      blood_type: user.patient_info?.blood_type,
      allergies: user.patient_info?.allergies,
      emergency_contact: user.patient_info?.emergency_contact_number
    }
  });

  const currentPayload = qrMode === 'basic' ? basicPayload : securePayload;

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Present this QR code to government personnel for quick verification.
      </Text>

      {/* Mode Toggle */}
      <View className="flex-row bg-gray-200 p-1 rounded-xl w-full mb-6">
        <TouchableOpacity 
          onPress={() => setQrMode('basic')}
          className={`flex-1 py-3 rounded-lg items-center flex-row justify-center ${qrMode === 'basic' ? 'bg-white shadow-sm' : ''}`}
        >
          <ShieldCheck size={16} color={qrMode === 'basic' ? '#10B981' : '#6B7280'} className="mr-2" />
          <Text className={`font-bold ${qrMode === 'basic' ? 'text-gray-900' : 'text-gray-500'}`}>Basic ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            if (qrMode !== 'secure') {
              Alert.alert('Secure Mode', 'This code contains sensitive medical data and will expire in 5 minutes.');
              setQrMode('secure');
            }
          }}
          className={`flex-1 py-3 rounded-lg items-center flex-row justify-center ${qrMode === 'secure' ? 'bg-white shadow-sm' : ''}`}
        >
          <ShieldAlert size={16} color={qrMode === 'secure' ? '#DC2626' : '#6B7280'} className="mr-2" />
          <Text className={`font-bold ${qrMode === 'secure' ? 'text-gray-900' : 'text-gray-500'}`}>Full Medical</Text>
        </TouchableOpacity>
      </View>

      {/* ID Card Wrapper */}
      <View className={`bg-white rounded-[32px] shadow-sm overflow-hidden mb-8 border ${qrMode === 'secure' ? 'border-red-300' : 'border-gray-100'}`}>
        
        {/* Red Header */}
        <View className={`${qrMode === 'secure' ? 'bg-red-700' : 'bg-red-600'} p-5 flex-row items-center gap-3`}>
          <View className="bg-white/20 p-2 rounded-xl">
            <ShieldAlert size={20} color="white" />
          </View>
          <View>
            <Text className="text-[10px] uppercase tracking-wider font-bold text-white/90">
              {qrMode === 'secure' ? 'SECURE MEDICAL ID' : 'Senior Citizen ID'}
            </Text>
            <Text className="font-medium text-base text-white">Caloocan City</Text>
          </View>
        </View>
        
        {/* ID Body */}
        <View className="p-8 items-center">
          
          <View className="bg-white p-4 rounded-3xl border border-gray-100 mb-6 w-full items-center justify-center shadow-sm">
            <QRCode
              value={currentPayload}
              size={180}
              color={qrMode === 'secure' ? '#DC2626' : '#1F2937'} 
              backgroundColor="white"
            />
          </View>
          
          {qrMode === 'secure' && (
            <View className="bg-red-50 px-4 py-2 rounded-xl flex-row items-center mb-6 border border-red-100">
              <Clock size={16} color="#DC2626" className="mr-2" />
              <Text className="text-red-700 font-bold">Expires in {formatTime(timeLeft)}</Text>
            </View>
          )}
          
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {user.first_name} {user.last_name}
          </Text>
          <Text className={`${qrMode === 'secure' ? 'text-red-600' : 'text-emerald-600'} font-bold text-base mb-3`}>
            ID: {user.display_id || user.osca_id || '--'}
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-6">
            📍 {user.patient_info?.barangay ? `Brgy. ${user.patient_info.barangay}, Caloocan City` : 'Caloocan City'}
          </Text>

          <TouchableOpacity className="w-full bg-red-50 border border-red-100 rounded-2xl py-4 flex-row items-center justify-center">
            <Download size={18} color="#DC2626" />
            <Text className="text-red-600 font-bold text-sm ml-2">Download Digital Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}