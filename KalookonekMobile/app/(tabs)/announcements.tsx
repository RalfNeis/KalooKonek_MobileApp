/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { GlobalText as Text } from '../../components/GlobalText';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore';
import { sortAnnouncements } from '../../lib/announcementUtils';

export default function Announcements() {
  const router = useRouter();
  const { dashboard, isLoading, fetchDashboardFromDjango } = useUserStore();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = ['ALL', 'Urgent', 'High Priority', 'Standard Information'];

  const rawFiltered = dashboard?.announcements?.filter((ann: any) => {
    if (activeFilter === 'ALL') return true;
    return ann.priority === activeFilter;
  }) || [];

  const filteredAnnouncements = sortAnnouncements(rawFiltered);

  return (
    <ScrollView 
      className="flex-1 bg-[#F8F9FA] p-5"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchDashboardFromDjango} colors={['#DC2626']} />}
    >
      <View className="mb-6 mt-2">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Announcements</Text>
        <Text className="text-gray-500 text-sm leading-relaxed mb-4">
          Stay updated with the latest news, events, and urgent alerts from your Barangay. Pull down to refresh.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  isActive 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {filter === 'Standard Information' ? 'Standard' : filter.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-col gap-5 mb-8">
        {filteredAnnouncements.length === 0 ? (
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 items-center justify-center mt-4">
            <Text className="text-gray-400 italic">-- No announcements found --</Text>
          </View>
        ) : (
          filteredAnnouncements.map((ann: any) => (
            <TouchableOpacity 
              key={ann.id} 
              onPress={() => router.push({ 
                pathname: '/announcement', 
                params: { title: ann.title, date: ann.date, time: ann.time, body: ann.body } 
              })}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden"
              activeOpacity={0.7}
            >
              <View 
                className="w-full h-1.5 absolute top-0 left-0 right-0" 
                style={{ backgroundColor: ann.priority === 'Urgent' ? '#EF4444' : (ann.priority === 'High Priority' ? '#F59E0B' : '#64748B') }} 
              />
              
              <View className="flex-row items-center gap-2 mb-4 mt-1">
                {ann.priority && (
                  <View className={`px-2.5 py-1 rounded-lg ${ann.priority === 'Urgent' ? 'bg-red-50' : (ann.priority === 'High Priority' ? 'bg-amber-50' : 'bg-slate-50')}`}>
                     <Text className={`text-[10px] font-bold uppercase tracking-wider ${ann.priority === 'Urgent' ? 'text-red-600' : (ann.priority === 'High Priority' ? 'text-amber-600' : 'text-slate-600')}`}>
                       {ann.priority === 'Standard Information' ? 'STANDARD' : ann.priority}
                     </Text>
                  </View>
                )}
                <Text className="text-xs text-gray-400 font-medium">
                  {ann.date} {ann.time ? `• ${ann.time}` : ''}
                </Text>
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