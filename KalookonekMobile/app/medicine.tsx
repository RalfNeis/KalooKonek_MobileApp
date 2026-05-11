/// <reference types="nativewind/types" />
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, Clock, AlertCircle, ArrowLeft } from 'lucide-react-native';
import { useUserStore } from '../store/useUserStore';
import { apiClient } from '../api/client';

export default function Medicine() {
  const router = useRouter();
  const { dashboard } = useUserStore();
  
  // Track which specific medicine is currently being requested
  const [requestingId, setRequestingId] = useState<number | null>(null);

  const handleRequestRefill = async (medicineId: number, medicineName: string) => {
    Alert.alert(
      'Confirm Refill',
      `Are you sure you want to request a refill for ${medicineName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request', 
          onPress: async () => {
            setRequestingId(medicineId);
            try {
              // Send the refill request to your Django backend
              await apiClient.post('refill-request/', {
                medicine_id: medicineId
              });
              
              Alert.alert('Success', 'Your refill request has been sent to the Barangay Health Center.');
            } catch (error) {
              console.error("Refill request error:", error);
              Alert.alert('Error', 'Failed to send request. Please try again later.');
            } finally {
              setRequestingId(null);
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      
      {/* Clean Header */}
      <View className="px-5 pt-5 pb-4 bg-white flex-row items-center border-b border-gray-100 z-10">
        <Text className="text-xl font-bold text-gray-900">My Medicines</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-gray-500 text-sm mb-6 leading-relaxed">
          View your maintenance medicines prescribed by the health staff and request refills when you are running low.
        </Text>

        {/* Dynamic Medicine List */}
        {!dashboard?.medicines || dashboard.medicines.length === 0 ? (
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 items-center justify-center mt-2 min-h-[150px]">
            <Pill size={40} color="#E5E7EB" className="mb-3" />
            <Text className="text-gray-400 italic text-center">No maintenance medicines currently on file.</Text>
          </View>
        ) : (
          dashboard.medicines.map((med: any, index: number) => (
            <View key={index} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
              
              {/* Medicine Header */}
              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <Pill size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 text-lg">{med.name || 'Unknown Medicine'}</Text>
                  <Text className="text-emerald-600 font-bold text-xs">{med.dosage || 'Dosage not specified'}</Text>
                </View>
              </View>

              {/* Instructions Box */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                <View className="flex-row items-center gap-2 mb-1">
                  <Clock size={14} color="#6B7280" />
                  <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider">Instructions</Text>
                </View>
                <Text className="text-gray-600 text-sm font-medium leading-relaxed">
                  {med.instructions || 'Take as directed by your doctor.'}
                </Text>
              </View>

              {/* Refill Button */}
              <TouchableOpacity 
                onPress={() => handleRequestRefill(med.id, med.name)}
                disabled={requestingId === med.id}
                className={`w-full rounded-xl py-3 items-center flex-row justify-center gap-2 ${requestingId === med.id ? 'bg-emerald-400' : 'bg-emerald-600'}`}
              >
                {requestingId === med.id ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  /* FIX: Replaced the Fragment <> with a View! */
                  <View className="flex-row items-center gap-2">
                    <AlertCircle size={18} color="white" />
                    <Text className="text-white font-bold text-sm">Request Refill</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}