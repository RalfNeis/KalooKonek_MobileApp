/// <reference types="nativewind/types" />
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network';
import { HeartPulse, Pill, Calendar as CalendarIcon, PhoneCall, ShieldAlert, ArrowRight, QrCode, WifiOff } from 'lucide-react-native';

// Import our new Offline-First Store!
import { useUserStore } from '../../store/useUserStore'; 

// Temporary fallback if store is completely empty on first install
const FALLBACK_USER = {
  firstName: "Juan", lastName: "Cruz", name: "Juan Cruz", osca_id: "2025-001", address: "Brgy. 172, Caloocan City", avatar: "🧑🏼‍🦳"
};

export default function Dashboard() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  
  // Pull state from our Zustand store
  const { user, fetchUserFromDjango, isLoading, lastUpdated } = useUserStore();

  // The active user is either the one from Django/Storage, or the fallback
  const activeUser = user || FALLBACK_USER;

  // On screen load, check network and fetch background updates
  useEffect(() => {
    checkNetworkAndFetch();
  }, []);

  const checkNetworkAndFetch = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsOffline(!networkState.isConnected);

    if (networkState.isConnected) {
      // If we have internet, quietly ask Django for updates!
      await fetchUserFromDjango();
    }
  };

  const actions = [
    { icon: HeartPulse, label: 'Health Records', desc: 'View checkups', color: '#3B82F6', bg: 'bg-blue-50', path: '/health' },
    { icon: Pill, label: 'Medicine', desc: 'Request refill', color: '#10B981', bg: 'bg-emerald-50', path: '/medicine' },
    { icon: CalendarIcon, label: 'Appointments', desc: 'OSCA Schedule', color: '#F59E0B', bg: 'bg-amber-50', path: '/appointments' },
    { icon: PhoneCall, label: 'Emergency', desc: 'Contact Barangay', color: '#8B5CF6', bg: 'bg-purple-50', path: '/emergency' }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-[#F8F9FA] p-4"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={checkNetworkAndFetch} colors={['#DC2626']} />}
    >
      {/* OFFLINE INDICATOR */}
      {isOffline && (
        <View className="bg-gray-800 rounded-xl p-3 flex-row items-center justify-center gap-2 mb-4">
          <WifiOff size={16} color="white" />
          <Text className="text-white text-xs font-bold">Offline Mode. Showing saved data.</Text>
        </View>
      )}

      {/* Greeting Section */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900">
          Mabuhay, <Text className="text-red-600">{activeUser.firstName}!</Text>
        </Text>
        <Text className="text-gray-500 mt-2 text-sm leading-relaxed">
          Welcome to your official Barangay portal. Access your benefits, view announcements, and manage your health records here.
        </Text>
      </View>

      {/* Digital ID Card */}
      <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <View className="bg-red-600 p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="bg-white/20 p-2 rounded-xl"><ShieldAlert size={20} color="white" /></View>
            <View>
              <Text className="text-[10px] uppercase tracking-wider font-bold text-white/90">Senior Citizen ID</Text>
              <Text className="font-medium text-sm text-white">Caloocan City</Text>
            </View>
          </View>
        </View>
        
        <View className="p-6 items-center">
          <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center mb-4">
            <Text className="text-4xl">{activeUser.avatar || "🧑🏼‍🦳"}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{activeUser.firstName} {activeUser.lastName || "Cruz"}</Text>
          <Text className="text-red-600 font-bold text-sm mt-1">ID: {activeUser.osca_id}</Text>
          <Text className="text-xs text-gray-500 mt-2 mb-6 text-center">{activeUser.address}</Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/qrcode')}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 items-center justify-center"
          >
            <QrCode size={36} color="#1F2937" />
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Tap to Scan Verification
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View className="flex-row flex-wrap justify-between mb-8">
        {actions.map((act, i) => (
          <TouchableOpacity 
            key={i} 
            onPress={() => router.push(act.path as any)}
            className="w-[48%] bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm flex-row items-center gap-3"
          >
            <View className={`${act.bg} p-3 rounded-xl`}><act.icon size={24} color={act.color} /></View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-sm">{act.label}</Text>
              <Text className="text-[10px] text-gray-500 mt-0.5">{act.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
