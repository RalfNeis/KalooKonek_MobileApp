/// <reference types="nativewind/types" />
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { ShieldAlert, Download, ShieldCheck, Clock, RefreshCw, Lock, MapPin } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useKeepAwake } from 'expo-keep-awake';
import * as Brightness from 'expo-brightness';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';
import { supabase } from '../lib/supabase';

export default function QRCodeScreen() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'basic' | 'medical'>('basic');
  
  const [basicQrImage, setBasicQrImage] = useState<string | null>(null);
  const [secureQrImage, setSecureQrImage] = useState<string | null>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [originalBrightness, setOriginalBrightness] = useState<number | null>(null);
  const qrCardRef = useRef(null);

  useKeepAwake();

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
        console.log("Brightness adjustment not supported.");
      }
    };
    setupBrightness();

    return () => {
      isMounted = false;
      const restoreBrightness = async () => {
        if (originalBrightness !== null) {
          try {
            await Brightness.setBrightnessAsync(originalBrightness);
          } catch (e) {}
        }
      };
      restoreBrightness();
    };
  }, [originalBrightness]);

  const fetchQrImage = async (endpoint: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const baseUrl = (apiClient.defaults.baseURL || 'http://10.0.2.2:8000/').replace(/\/$/, '') + '/';

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      }
    });

    if (!response.ok) throw new Error('Failed to fetch QR code from server');

    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const loadBasicQR = async () => {
      try {
        const base64Image = await fetchQrImage('qr/patient/basic.html');
        setBasicQrImage(base64Image);
      } catch (error) {
        console.error("Failed to load basic QR", error);
      }
    };
    if (user) loadBasicQR();
  }, [user]);

  // UPGRADED: Absolute Time Countdown Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (expiryTimestamp && secureQrImage) {
      const tick = () => {
        const now = Date.now();
        // Calculate the difference between the absolute expiry time and the current system clock
        const remaining = Math.max(0, Math.floor((expiryTimestamp - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) {
          setSecureQrImage(null);
          setExpiryTimestamp(null);
          clearInterval(interval);
        }
      };

      tick(); // Run immediately so there isn't a 1-second visual lag
      interval = setInterval(tick, 1000);
    }

    return () => clearInterval(interval);
  }, [expiryTimestamp, secureQrImage]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleGenerateSecureQR = async () => {
    setIsGenerating(true);
    try {
      const base64Image = await fetchQrImage('qr/patient/full.html');
      setSecureQrImage(base64Image);
      
      // Calculate the exact future timestamp for expiration (15 minutes = 900 seconds)
      const ttl = 900;
      setExpiryTimestamp(Date.now() + (ttl * 1000));
      setTimeLeft(ttl);
      
    } catch (error) {
      Alert.alert('Error', 'Could not generate secure token from server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if ((activeTab === 'medical' && !secureQrImage)) {
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
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
        <ActivityIndicator color="#DC2626" size="large" />
      </View>
    );
  }

  const displayName = `${user.first_name} ${user.last_name}`;
  const displayId = user.display_id || user.osca_id || 'PENDING';
  const location = user.patient_info?.barangay ? `Brgy. ${user.patient_info.barangay}, Caloocan City` : 'Caloocan City';

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
        Present this QR code to government personnel for quick verification.
      </Text>

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

      <View 
        ref={qrCardRef} 
        collapsable={false}
        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6"
      >
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

        <View className="px-6 py-8 items-center w-full">
          
          {activeTab === 'basic' && !basicQrImage ? (
             <View className="w-56 h-56 bg-gray-50 rounded-3xl border border-gray-100 items-center justify-center">
               <ActivityIndicator color="#1F2937" size="large" />
             </View>
          ) : activeTab === 'medical' && !secureQrImage ? (
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
            <View className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center justify-center w-56 h-56">
              <Image 
                source={{ uri: activeTab === 'medical' ? secureQrImage! : basicQrImage! }} 
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          )}

          <View className="items-center mt-6 w-full">
            <Text className="text-xl font-bold text-gray-900 text-center">{displayName}</Text>
            <Text className={`font-bold text-sm mt-1 text-center ${activeTab === 'medical' ? 'text-red-600' : 'text-emerald-600'}`}>
              ID: {displayId}
            </Text>
            <View className="flex-row items-center justify-center mt-2 mb-2">
              <MapPin size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 font-medium ml-1 text-center">{location}</Text>
            </View>

            {activeTab === 'medical' && secureQrImage && (
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

      <View className="items-center mb-10 mt-2">
        <TouchableOpacity 
          onPress={handleDownload}
          disabled={isDownloading || (activeTab === 'medical' && !secureQrImage)}
          className={`py-3 px-6 rounded-full flex-row items-center justify-center border
            ${(activeTab === 'medical' && !secureQrImage) 
              ? 'bg-gray-50 border-gray-100' 
              : 'bg-red-50 border-red-100'}`}
        >
          {isDownloading ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Download size={18} color={(activeTab === 'medical' && !secureQrImage) ? "#9CA3AF" : "#DC2626"} />
              <Text className={`font-bold text-sm ${(activeTab === 'medical' && !secureQrImage) ? "text-gray-400" : "text-red-600"}`}>
                Download Digital Copy
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}