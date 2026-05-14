/// <reference types="nativewind/types" />
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore';

export default function Announcements() {
  const router = useRouter();
  
  // FIX: Grab isLoading and the fetch function from your store
  const { dashboard, isLoading, fetchDashboardFromDjango } = useUserStore();

  return (
    <ScrollView 
      className="flex-1 bg-[#F8F9FA] p-5"
      // FIX: Added the native Pull-to-Refresh control!
      refreshControl={
        <RefreshControl 
          refreshing={isLoading} 
          onRefresh={fetchDashboardFromDjango} 
          colors={['#DC2626']} 
        />
      }
    >
      <View className="mb-6 mt-2">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Announcements</Text>
        <Text className="text-gray-500 text-sm leading-relaxed">
          Stay updated with the latest news, events, and urgent alerts from your Barangay. Pull down to refresh.
        </Text>
      </View>

      <View className="flex-col gap-5 mb-8">
        {!dashboard?.announcements || dashboard.announcements.length === 0 ? (
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 items-center justify-center mt-4">
            <Text className="text-gray-400 italic">-- No announcements at this time --</Text>
          </View>
        ) : (
          dashboard.announcements.map((ann: any) => (
            <TouchableOpacity 
              key={ann.id} 
              onPress={() => router.push({ 
                pathname: '/announcement', 
                params: { title: ann.title, date: ann.date, body: ann.body } 
              })}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden"
              activeOpacity={0.7}
            >
              <View 
                className="w-full h-1.5 absolute top-0 left-0 right-0" 
                style={{ backgroundColor: ann.type === 'URGENT' ? '#EF4444' : (ann.type === 'PENSION' ? '#3B82F6' : (ann.type === 'EVENT' ? '#10B981' : '#DC2626')) }} 
              />
              
              <View className="flex-row items-center gap-2 mb-4 mt-1">
                {ann.type && (
                  <View className={`px-2.5 py-1 rounded-lg ${ann.type === 'URGENT' ? 'bg-red-50' : (ann.type === 'PENSION' ? 'bg-blue-50' : (ann.type === 'EVENT' ? 'bg-emerald-50' : 'bg-gray-100'))}`}>
                     <Text className={`text-[10px] font-bold uppercase tracking-wider ${ann.type === 'URGENT' ? 'text-red-600' : (ann.type === 'PENSION' ? 'text-blue-600' : (ann.type === 'EVENT' ? 'text-emerald-600' : 'text-gray-600'))}`}>
                       {ann.type}
                     </Text>
                  </View>
                )}
                <Text className="text-xs text-gray-400 font-medium">{ann.date}</Text>
              </View>
              
              <Text className="font-bold text-gray-900 text-xl mb-3">{ann.title}</Text>
              
              <Text className="text-sm text-gray-600 leading-relaxed mb-5" numberOfLines={3}>
                {ann.body || ann.desc}
              </Text>
              
              <View className="flex-row items-center gap-1.5 self-start">
                <Text className="text-sm font-bold text-red-600">Read Full Details</Text>
                <ArrowRight size={16} color="#EF4444" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}