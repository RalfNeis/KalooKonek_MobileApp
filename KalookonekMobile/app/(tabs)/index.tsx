/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  HeartPulse, Pill, Calendar as CalendarIcon, 
  PhoneCall, ShieldAlert, ArrowRight, QrCode 
} from 'lucide-react-native';

const USER_DATA = {
  name: "Juan Cruz",
  firstName: "Juan",
  id: "2025-001",
  address: "Brgy. 172, Caloocan City",
  avatar: "🧑🏼‍🦳",
};

const ANNOUNCEMENTS = [
  { id: 1, type: 'URGENT', date: 'Today, 8:00 AM', title: 'Free Medical Mission', desc: 'The Barangay Health Center will be conducting free checkups and medicine distribution this weekend.' },
  { id: 2, type: 'PENSION', date: 'Yesterday', title: 'Social Pension Update', desc: 'The DSWD Social Pension payout schedule has been released for the 3rd quarter.' }
];

export default function Dashboard() {
  const router = useRouter();

  const actions = [
    { icon: HeartPulse, label: 'Health Records', desc: 'View checkups', color: '#3B82F6', bg: 'bg-blue-50', path: '/health' },
    { icon: Pill, label: 'Medicine', desc: 'Request refill', color: '#10B981', bg: 'bg-emerald-50', path: '/medicine' },
    { icon: CalendarIcon, label: 'Appointments', desc: 'OSCA Schedule', color: '#F59E0B', bg: 'bg-amber-50', path: '/appointments' },
    { icon: PhoneCall, label: 'Emergency', desc: 'Contact Barangay', color: '#8B5CF6', bg: 'bg-purple-50', path: '/emergency' }
  ];

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-4">
      {/* Greeting Section */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900">
          Mabuhay, <Text className="text-red-600">{USER_DATA.firstName}!</Text>
        </Text>
        <Text className="text-gray-500 mt-2 text-sm leading-relaxed">
          Welcome to your official Barangay portal. Access your benefits, view announcements, and manage your health records here.
        </Text>
      </View>

      {/* Digital ID Card */}
      <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <View className="bg-red-600 p-4 flex-row items-center gap-3">
          <View className="bg-white/20 p-2 rounded-xl"><ShieldAlert size={20} color="white" /></View>
          <View>
            <Text className="text-[10px] uppercase tracking-wider font-bold text-white/90">Senior Citizen ID</Text>
            <Text className="font-medium text-sm text-white">Caloocan City</Text>
          </View>
        </View>
        
        <View className="p-6 items-center">
          <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center mb-4">
            <Text className="text-4xl">{USER_DATA.avatar}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{USER_DATA.name}</Text>
          <Text className="text-red-600 font-bold text-sm mt-1">ID: {USER_DATA.id}</Text>
          <Text className="text-xs text-gray-500 mt-2 mb-6 text-center">{USER_DATA.address}</Text>
          
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
            <View className={`${act.bg} p-3 rounded-xl`}>
              <act.icon size={24} color={act.color} />
            </View>
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

        {ANNOUNCEMENTS.map(ann => (
          <TouchableOpacity 
            key={ann.id} 
            onPress={() => router.push('/announcement')}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4 overflow-hidden"
          >
            <View className="w-full h-1 absolute top-0 left-0 right-0 bg-red-500" style={{ backgroundColor: ann.type === 'URGENT' ? '#EF4444' : '#3B82F6' }} />
            
            <View className="flex-row items-center gap-2 mb-2 mt-1">
              <View className={`px-2 py-0.5 rounded ${ann.type === 'URGENT' ? 'bg-red-50' : 'bg-blue-50'}`}>
                 <Text className={`text-[9px] font-bold uppercase tracking-wider ${ann.type === 'URGENT' ? 'text-red-600' : 'text-blue-600'}`}>
                   {ann.type}
                 </Text>
              </View>
              <Text className="text-[10px] text-gray-400 font-medium">{ann.date}</Text>
            </View>
            
            <Text className="font-bold text-gray-900 text-sm mb-1">{ann.title}</Text>
            <Text className="text-xs text-gray-500 leading-relaxed mb-3" numberOfLines={2}>{ann.desc}</Text>
            
            <View className="flex-row items-center gap-1">
              <Text className="text-xs font-bold text-red-600">Read More</Text>
              <ArrowRight size={12} color="#EF4444" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
