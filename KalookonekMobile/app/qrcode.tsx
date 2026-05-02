/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { ShieldAlert, QrCode, Download } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';

export default function QRCodeScreen() {
  // Pull the logged-in user data from the store
  const { user } = useUserStore();

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="text-gray-500 text-sm mb-8 leading-relaxed">
        Present this QR code to government personnel for quick verification.
      </Text>

      <View className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Red Header */}
        <View className="bg-red-600 p-5 flex-row items-center gap-3">
          <View className="bg-white/20 p-2 rounded-xl">
            <ShieldAlert size={20} color="white" />
          </View>
          <View>
            <Text className="text-[10px] uppercase tracking-wider font-bold text-white/90">Senior Citizen ID</Text>
            <Text className="font-medium text-base text-white">Caloocan City</Text>
          </View>
        </View>
        
        {/* ID Body */}
        <View className="p-8 items-center">
          <View className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-6 w-full items-center justify-center">
            <QrCode size={160} color="#1F2937" />
          </View>
          
          {/* Dynamic User Data */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {user ? `${user.first_name} ${user.last_name}` : '--'}
          </Text>
          <Text className="text-red-600 font-bold text-base mb-3">
            ID: {user?.display_id || '--'}
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-6">
            📍 {user?.patient_info?.barangay ? `Brgy. ${user.patient_info.barangay}, Caloocan City` : '--'}
          </Text>

          {/* Fixed Android NativeWind gap bug by using ml-2 on Text instead of gap-2 on wrapper */}
          <TouchableOpacity className="w-full bg-red-50 border border-red-100 rounded-2xl py-4 flex-row items-center justify-center">
            <Download size={18} color="#DC2626" />
            <Text className="text-red-600 font-bold text-sm ml-2">Download Digital Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}