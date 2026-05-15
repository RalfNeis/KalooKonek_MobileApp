/// <reference types="nativewind/types" />
import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network';
import { HeartPulse, Calendar as CalendarIcon, PhoneCall, ShieldAlert, ArrowRight, QrCode, WifiOff, User } from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore'; 
import { supabase } from '../../lib/supabase';
import Skeleton from '../../components/Skeleton'; 
import { translations } from '../../lib/i18n'; 

const SUPABASE_PIC_URL = 'https://lukdudigghvsqizkukeq.supabase.co/storage/v1/object/public/profile-pictures/';

export default function Dashboard() {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  
  const { user, dashboard, fetchUserFromDjango, fetchDashboardFromDjango, isLoading, language } = useUserStore();
  const firstName = user?.first_name || 'Citizen';
  const t = translations[language]; 
  
  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        checkNetworkAndFetch();
      }
    };
    initDashboard();
  }, []);
  
  const checkNetworkAndFetch = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsOffline(!networkState.isConnected);

    if (networkState.isConnected) {
      await fetchUserFromDjango();
      await fetchDashboardFromDjango();
    }
  };

  const actions = [
    { icon: HeartPulse, label: t.healthRecords, desc: t.viewCheckups, color: '#3B82F6', bg: 'bg-blue-50', path: '/health' },
    { icon: CalendarIcon, label: t.appointments, desc: t.oscaSchedule, color: '#F59E0B', bg: 'bg-amber-50', path: '/appointments' },
    { icon: PhoneCall, label: t.emergency, desc: t.contactBarangay, color: '#8B5CF6', bg: 'bg-purple-50', path: '/emergency' }
  ];

  if (isLoading && !dashboard && !user) {
    return (
      <View className="flex-1 bg-[#F8F9FA] p-5 pt-16">
        <Skeleton width="100%" height={260} className="rounded-3xl mb-8" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-[#F8F9FA] p-4 pt-8"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={checkNetworkAndFetch} colors={['#DC2626']} />}
    >
      {isOffline && (
        <View className="bg-gray-800 rounded-xl p-3 flex-row items-center justify-center gap-2 mb-4">
          <WifiOff size={16} color="white" />
          <Text className="text-white text-xs font-bold">{t.offlineMode}</Text>
        </View>
      )}

      {/* Greeting Section */}
      <View className="mb-6 mt-4">
        <Text className="text-4xl font-extrabold text-gray-900 mb-1">
          Mabuhay, <Text className="text-4xl font-extrabold text-red-600">{firstName}!</Text>
        </Text>
        <Text className="text-gray-500 mt-2 text-base leading-relaxed">
          {t.welcomeMessage}
        </Text>
      </View>

      {/* Digital ID Card */}
      <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <View className="bg-red-600 p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="bg-white/20 p-2 rounded-xl"><ShieldAlert size={20} color="white" /></View>
            <View>
              <Text className="text-[10px] uppercase tracking-wider font-bold text-white/90">{t.seniorCitizenId}</Text>
              <Text className="font-medium text-sm text-white">{t.city}</Text>
            </View>
          </View>
        </View>
        
        <View className="p-6 items-center">
          <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
          {(user as any)?.profile_picture ? (
            <Image 
              source={{ 
                uri: (user as any).profile_picture.startsWith('http') 
                  ? (user as any).profile_picture 
                  : `${SUPABASE_PIC_URL}${(user as any).profile_picture}` 
              }} 
              className="w-full h-full" 
            />
          ) : (
            <User size={40} color="#DC2626" />
          )}
        </View>
          
          {user ? (
            <>
              <Text className="text-xl font-bold text-gray-900 text-center">{user.first_name} {user.last_name}</Text>
              <Text className="text-red-600 font-bold text-sm mt-1">ID: {user.display_id || user.osca_id}</Text>
              
              {/* Note: This explicitly forces Barangay or defaults to Caloocan City */}
              <Text className="text-xs text-gray-500 mt-2 mb-6 text-center font-medium">
              {user.patient_info?.barangay 
              ? `Brgy. ${user.patient_info.barangay.replace(/^(brgy\.?|barangay)\s*/i, '')}, Caloocan City` 
              : 'Caloocan City'}
              </Text>
            </>
          ) : (
            <Text className="text-gray-400 mb-6 mt-2">{t.loginToView}</Text>
          )}
          
          <TouchableOpacity 
            onPress={() => router.push('/qrcode')}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 items-center justify-center"
          >
            <QrCode size={36} color="#1F2937" />
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex-wrap text-center">
              {t.tapToScan}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Grid - Hardcoded to bypass NativeWind Bug */}
      <View className="mb-8 w-full">
        {/* Top Row: Health & Appointments */}
        <View className="flex-row justify-between mb-4 w-full">
          <TouchableOpacity onPress={() => router.push(actions[0].path as any)} className="w-[48%] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-col items-start gap-3">
            <View className={`${actions[0].bg} p-3 rounded-xl`}><HeartPulse size={24} color={actions[0].color} /></View>
            <View className="w-full">
              <Text className="font-bold text-gray-900 text-sm flex-wrap">{actions[0].label}</Text>
              <Text className="text-[10px] text-gray-500 mt-1 flex-wrap">{actions[0].desc}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push(actions[1].path as any)} className="w-[48%] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-col items-start gap-3">
            <View className={`${actions[1].bg} p-3 rounded-xl`}><CalendarIcon size={24} color={actions[1].color} /></View>
            <View className="w-full">
              <Text className="font-bold text-gray-900 text-sm flex-wrap">{actions[1].label}</Text>
              <Text className="text-[10px] text-gray-500 mt-1 flex-wrap">{actions[1].desc}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Emergency (Inline styles guarantee centering) */}
        <TouchableOpacity 
          onPress={() => router.push(actions[2].path as any)}
          style={{ 
            width: '100%', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#ffffff', 
            borderColor: '#F3F4F6', 
            borderWidth: 1, 
            borderRadius: 16, 
            paddingVertical: 20, 
            elevation: 1,
            position: 'relative'
          }}
        >
          {/* Absolute positioning locks the icon to the left so it doesn't push the text */}
          <View className={`${actions[2].bg} p-3 rounded-xl`} style={{ position: 'absolute', left: 16 }}>
            <PhoneCall size={24} color={actions[2].color} />
          </View>
          
          <View>
            <Text className="font-bold text-gray-900 text-base text-center">{actions[2].label}</Text>
            <Text className="text-xs text-gray-500 mt-1 text-center">{actions[2].desc}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <View className="mb-12">
        <View className="flex-row flex-wrap items-center justify-between mb-4 gap-y-2">
          <View className="flex-row items-center gap-2 pr-2">
            <ShieldAlert size={18} color="#EF4444" />
            <Text className="font-bold text-gray-900 flex-wrap">{t.barangayAnnouncements}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/announcements')} className="mt-1">
            <Text className="text-xs font-bold text-red-600">{t.viewAll}</Text>
          </TouchableOpacity>
        </View>

        {!dashboard?.announcements || dashboard.announcements.length === 0 ? (
           <View className="bg-white border border-gray-100 rounded-2xl p-6 items-center">
             <Text className="text-gray-400 text-center flex-wrap">{t.noAnnouncements}</Text>
           </View>
        ) : (
          dashboard.announcements.slice(0, 2).map((ann) => (
            <TouchableOpacity 
              key={ann.id} 
              onPress={() => router.push({ 
                pathname: '/announcement', 
                params: { title: ann.title, date: ann.date, body: ann.body } 
              })}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4 overflow-hidden"
            >
              <View className="w-full h-1 absolute top-0 left-0 right-0 bg-red-500" />
              <View className="flex-row items-center gap-2 mb-2 mt-1">
                <Text className="text-[10px] text-gray-400 font-medium">{ann.date}</Text>
              </View>
              <Text className="font-bold text-gray-900 text-sm mb-1 flex-wrap">{ann.title}</Text>
              <Text className="text-xs text-gray-500 leading-relaxed mb-3 flex-wrap">{ann.body}</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-xs font-bold text-red-600 mr-1">{t.readMore}</Text>
                <ArrowRight size={12} color="#EF4444" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}