/// <reference types="nativewind/types" />
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import QRCode from 'react-native-qrcode-svg';
import { ShieldAlert, Download, ShieldCheck, Clock, RefreshCw, Lock, MapPin } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useKeepAwake } from 'expo-keep-awake';
import * as Brightness from 'expo-brightness';
import { useUserStore } from '../store/useUserStore';

export default function QRCodeScreen() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'basic' | 'medical'>('basic');
  
  // Security & Download State
  const [isDownloading, setIsDownloading] = useState(false);
  const [secureToken, setSecureToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Brightness State
  const [originalBrightness, setOriginalBrightness] = useState<number | null>(null);

  const qrCardRef = useRef(null);

  // 1. Prevent screen from going to sleep
  useKeepAwake();

  // 2. Handle Auto-Brightness
  useEffect(() => {
    let isMounted = true;
    const setupBrightness = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          const current = await Brightness.getBrightnessAsync();
          if (isMounted) setOriginalBrightness(current);
          await Brightness.setBrightnessAsync(1.0);
        }
      } catch (error) {
        console.log("Brightness adjustment not supported on this device/simulator.");
      }
    };
    setupBrightness();

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

  // 3. Handle the countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeLeft > 0 && secureToken) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && secureToken) {
      setSecureToken(null);
    }
    return () => clearInterval(interval);
  }, [timeLeft, secureToken]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleGenerateSecureQR = async () => {
    setIsGenerating(true);
    try {
      const displayId = user?.display_id || user?.osca_id || 'PENDING';
      const mockJWT = `MED-${displayId}-${Date.now()}-SECURE`;
      setSecureToken(mockJWT);
      setTimeLeft(300); // 5 minutes
    } catch (error) {
      Alert.alert('Error', 'Could not generate secure token.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if ((activeTab === 'medical' && !secureToken)) {
      Alert.alert('Error', 'Please generate the secure QR code first.');
      return;
    }

    setIsDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'We need access to your gallery to save the ID.');
        setIsDownloading(false);
        return;
      }

      const localUri = await captureRef(qrCardRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      Alert.alert('Success', 'Digital ID successfully saved to your photo gallery!');
    } catch (error: any) {
      Alert.alert('System Error', error?.message || String(error));
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
        <Text className="text-gray-500">Loading Digital ID...</Text>
      </View>
    );
  }

  const displayName = `${user.first_name} ${user.last_name}`;
  const displayId = user.display_id || user.osca_id || 'PENDING';
  const location = user.patient_info?.barangay ? `Brgy. ${user.patient_info.barangay}, Caloocan City` : 'Caloocan City';
  const basicQRValue = JSON.stringify({ type: 'basic', id: displayId });

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Present this QR code to government personnel for quick verification.
      </Text>

      {/* Tab Switcher */}
      <View className="flex-row bg-gray-200 rounded-xl p-1 mb-6 w-full">
        <TouchableOpacity 
          onPress={() => setActiveTab('basic')}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-lg gap-2 ${activeTab === 'basic' ? 'bg-white shadow-sm' : ''}`}
        >
          <ShieldCheck size={16} color={activeTab === 'basic' ? '#10B981' : '#9CA3AF'} />
          <Text className={`font-bold text-sm ${activeTab === 'basic' ? 'text-gray-900' : 'text-gray-400'}`}>Basic ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('medical')}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-lg gap-2 ${activeTab === 'medical' ? 'bg-white shadow-sm' : ''}`}
        >
          <ShieldAlert size={16} color={activeTab === 'medical' ? '#DC2626' : '#9CA3AF'} />
          <Text className={`font-bold text-sm ${activeTab === 'medical' ? 'text-gray-900' : 'text-gray-400'}`}>Full Medical</Text>
        </TouchableOpacity>
      </View>

      {/* The Card we will screenshot */}
      <View 
        ref={qrCardRef} 
        collapsable={false}
        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6"
      >
        
        {/* Red Card Header */}
        <View className={`p-5 flex-row items-center gap-3 ${activeTab === 'medical' ? 'bg-red-700' : 'bg-red-600'}`}>
          <View className="bg-white/20 p-2 rounded-xl">
            {activeTab === 'medical' ? <Lock size={20} color="white" /> : <ShieldAlert size={20} color="white" />}
          </View>
          <View>
            <Text className="text-[10px] uppercase tracking-widest font-bold text-white/90">
              {activeTab === 'medical' ? 'SECURE MEDICAL ACCESS' : 'SENIOR CITIZEN ID'}
            </Text>
            <Text className="font-bold text-base text-white">Caloocan City</Text>
          </View>
        </View>

        {/* QR Code Area */}
        <View className="px-6 py-8 items-center w-full">
          
          {activeTab === 'medical' && !secureToken ? (
            // State 1: Medical Tab, needs generation
            <View className="w-64 h-64 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 items-center justify-center px-4">
              <Lock size={36} color="#9CA3AF" className="mb-3" />
              <Text className="text-gray-500 text-center text-sm font-medium mb-6 px-2">
                Medical data requires a one-time secure token.
              </Text>
              <TouchableOpacity 
                onPress={handleGenerateSecureQR}
                disabled={isGenerating}
                className="bg-red-600 px-5 py-3 rounded-xl flex-row items-center justify-center"
              >
                {isGenerating ? (
                  <ActivityIndicator color="white" size="small"/>
                ) : (
                  <View className="flex-row items-center justify-center gap-2">
                    <RefreshCw size={16} color="white" />
                    <Text className="text-white font-bold text-sm">Generate Token</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // State 2: Basic QR or Generated Medical QR
            <View className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center justify-center w-56 h-56">
              <QRCode
                value={activeTab === 'medical' ? secureToken! : basicQRValue}
                size={180}
                color={activeTab === 'medical' ? '#DC2626' : '#1F2937'}
                backgroundColor="white"
              />
            </View>
          )}

          {/* Patient Info */}
          <View className="items-center mt-6 w-full">
            <Text className="text-xl font-bold text-gray-900 text-center">{displayName}</Text>
            
            <Text className={`font-bold text-sm mt-1 text-center ${activeTab === 'medical' ? 'text-red-600' : 'text-emerald-600'}`}>
              ID: {displayId}
            </Text>
            
            <View className="flex-row items-center justify-center mt-2 mb-2">
              <MapPin size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 font-medium ml-1 text-center">{location}</Text>
            </View>

            {/* Medical Timer Display */}
            {activeTab === 'medical' && secureToken && (
              <View className="bg-red-50 px-5 py-2.5 rounded-full border border-red-100 mt-3 flex-row items-center justify-center">
                <Clock size={14} color="#DC2626" />
                <Text className="text-red-700 font-bold text-xs uppercase tracking-wider ml-2">
                  Expires in {formatTime(timeLeft)}
                </Text>
              </View>
            )}
          </View>

        </View>
      </View>

      {/* Download Button */}
      <View className="items-center mb-10 mt-2">
        <TouchableOpacity 
          onPress={handleDownload}
          disabled={isDownloading || (activeTab === 'medical' && !secureToken)}
          className={`py-3 px-6 rounded-full flex-row items-center justify-center border
            ${(activeTab === 'medical' && !secureToken) 
              ? 'bg-gray-50 border-gray-100' 
              : 'bg-red-50 border-red-100'}`}
        >
          {isDownloading ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Download size={18} color={(activeTab === 'medical' && !secureToken) ? "#9CA3AF" : "#DC2626"} />
              <Text className={`font-bold text-sm ${(activeTab === 'medical' && !secureToken) ? "text-gray-400" : "text-red-600"}`}>
                Download Digital Copy
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}