/// <reference types="nativewind/types" />
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network';
import { HeartPulse, Pill, Calendar as CalendarIcon, PhoneCall, ShieldAlert, ArrowRight, QrCode, WifiOff, User } from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore'; 
import { supabase } from '../../lib/supabase';


export default function Dashboard() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  
  // Pull state from our Zustand store
  const { user, dashboard, fetchUserFromDjango, fetchDashboardFromDjango, isLoading } = useUserStore();
  const firstName = user?.first_name || 'Citizen';
  
  useEffect(() => {
    // Check Supabase safely AFTER the dashboard component mounts
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Safe redirect!
        router.replace('/login');
      } else {
        // Only fetch from Django if logged in
        checkNetworkAndFetch();
      }
    };

    initDashboard();
  }, []);
  
  const checkNetworkAndFetch = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsOffline(!networkState.isConnected);

    // Fetch as long as we have an internet connection!
    // (The useEffect already proved we have a Supabase session)
    if (networkState.isConnected) {
      await fetchUserFromDjango();
      await fetchDashboardFromDjango();
    }
  };

  const handleLogout = async () => {
    // Tell Supabase to destroy the local session data
    await supabase.auth.signOut();
    // Force the app to jump to the login screen
    router.replace('/login');
  };

  // Static navigation actions (These stay because they are UI buttons, not DB data)
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
      {isOffline && (
        <View className="bg-gray-800 rounded-xl p-3 flex-row items-center justify-center gap-2 mb-4">
          <WifiOff size={16} color="white" />
          <Text className="text-white text-xs font-bold">Offline Mode.</Text>
        </View>
      )}

      {/* Greeting Section */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900">
          Mabuhay, <Text className="text-red-600">{firstName}!</Text>
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
       <User size={40} color="#DC2626" />
    </View>
    
    {isLoading ? (
      <ActivityIndicator color="#DC2626" className="mb-6" />
    ) : user ? (
      <>
        <Text className="text-xl font-bold text-gray-900">{user.first_name} {user.last_name}</Text>
        <Text className="text-red-600 font-bold text-sm mt-1">ID: {user.display_id || user.osca_id}</Text>
        <Text className="text-xs text-gray-500 mt-2 mb-6 text-center">
          {user.patient_info?.address || 'Caloocan City, Philippines'}
        </Text>
      </>
    ) : (
      <Text className="text-gray-400 mb-6 mt-2">Please log in to view ID</Text>
    )}
    
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

      {/* Announcements */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <ShieldAlert size={18} color="#EF4444" />
            <Text className="font-bold text-gray-900">Barangay Announcements</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/announcements')}>
            <Text className="text-xs font-bold text-red-600">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamically render from backend, or show empty state */}
        {!dashboard?.announcements || dashboard.announcements.length === 0 ? (
           <View className="bg-white border border-gray-100 rounded-2xl p-6 items-center">
             <Text className="text-gray-400">No announcements at this time.</Text>
           </View>
        ) : (
          dashboard.announcements.map((ann) => (
            <TouchableOpacity 
              key={ann.id} 
              onPress={() => router.push('/announcement')}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4 overflow-hidden"
            >
              <View className="w-full h-1 absolute top-0 left-0 right-0 bg-red-500" />
              <View className="flex-row items-center gap-2 mb-2 mt-1">
                <Text className="text-[10px] text-gray-400 font-medium">{ann.date}</Text>
              </View>
              <Text className="font-bold text-gray-900 text-sm mb-1">{ann.title}</Text>
              <Text className="text-xs text-gray-500 leading-relaxed mb-3" numberOfLines={2}>{ann.body}</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-red-600">Read More</Text>
                <ArrowRight size={12} color="#EF4444" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}