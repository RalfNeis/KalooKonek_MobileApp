/// <reference types="nativewind/types" />
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

const ANNOUNCEMENTS = [
  { id: 1, type: 'URGENT', date: 'Today, 8:00 AM', title: 'Free Medical Mission', desc: 'The Barangay Health Center will be conducting free checkups and medicine distribution this weekend. Please bring your valid Senior Citizen ID and medical booklets.' },
  { id: 2, type: 'PENSION', date: 'Yesterday', title: 'Social Pension Update', desc: 'The DSWD Social Pension payout schedule has been released for the 3rd quarter. Distribution will be at the covered court starting at 8:00 AM based on your family name.' },
  { id: 3, type: 'EVENT', date: 'Oct 12, 2025', title: 'Zumba for Seniors', desc: 'Join us for a fun and healthy Zumba session tailored specifically for senior citizens! Every Saturday morning at the Barangay Plaza.' }
];

export default function Announcements() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <View className="mb-6 mt-2">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Announcements</Text>
        <Text className="text-gray-500 text-sm leading-relaxed">
          Stay updated with the latest news, events, and urgent alerts from your Barangay.
        </Text>
      </View>

      <View className="flex-col gap-5 mb-8">
        {ANNOUNCEMENTS.map(ann => (
          <TouchableOpacity 
            key={ann.id} 
            onPress={() => router.push('/announcement')}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden"
            activeOpacity={0.7}
          >
            {/* Top colored border indicator */}
            <View 
              className="w-full h-1.5 absolute top-0 left-0 right-0" 
              style={{ backgroundColor: ann.type === 'URGENT' ? '#EF4444' : (ann.type === 'PENSION' ? '#3B82F6' : '#10B981') }} 
            />
            
            <View className="flex-row items-center gap-2 mb-4 mt-1">
              <View className={`px-2.5 py-1 rounded-lg ${ann.type === 'URGENT' ? 'bg-red-50' : (ann.type === 'PENSION' ? 'bg-blue-50' : 'bg-emerald-50')}`}>
                 <Text className={`text-[10px] font-bold uppercase tracking-wider ${ann.type === 'URGENT' ? 'text-red-600' : (ann.type === 'PENSION' ? 'text-blue-600' : 'text-emerald-600')}`}>
                   {ann.type}
                 </Text>
              </View>
              <Text className="text-xs text-gray-400 font-medium">{ann.date}</Text>
            </View>
            
            <Text className="font-bold text-gray-900 text-xl mb-3">{ann.title}</Text>
            <Text className="text-sm text-gray-600 leading-relaxed mb-5" numberOfLines={3}>{ann.desc}</Text>
            
            <View className="flex-row items-center gap-1.5 self-start">
              <Text className="text-sm font-bold text-red-600">Read Full Details</Text>
              <ArrowRight size={16} color="#EF4444" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}