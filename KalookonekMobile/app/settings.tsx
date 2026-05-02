/// <reference types="nativewind/types" />
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, User, Bell, Shield, ChevronRight } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    // Add a confirmation pop-up so senior citizens don't accidentally log out
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of KalooKonek?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            // Destroy the session and route to login!
            await supabase.auth.signOut();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-gray-50 p-2 rounded-lg mr-3">
          <Icon size={20} color="#4B5563" />
        </View>
        <Text className="text-gray-700 font-medium text-base">{label}</Text>
      </View>
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F8F9FA] p-4">
      
      {/* Settings Menu Card */}
      <View className="bg-white rounded-2xl px-4 pt-2 pb-2 mb-6 shadow-sm border border-gray-100">
        <MenuItem icon={User} label="Personal Information" />
        <MenuItem icon={Bell} label="Notifications" />
        <MenuItem icon={Shield} label="Privacy & Security" />
      </View>

      {/* Official Logout Button */}
      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-white rounded-2xl p-4 flex-row items-center justify-center shadow-sm border border-red-100 mt-auto mb-8"
      >
        <LogOut size={20} color="#DC2626" className="mr-2" />
        <Text className="text-red-600 font-bold text-base">Sign Out</Text>
      </TouchableOpacity>
      
    </View>
  );
}