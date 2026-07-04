/// <reference types="nativewind/types" />
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Delete, Fingerprint } from 'lucide-react-native';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onBiometricPress?: () => void;
  showBiometric?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ 
  onKeyPress, 
  onDelete, 
  onBiometricPress,
  showBiometric = false
}) => {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [showBiometric ? 'bio' : 'empty', '0', 'delete']
  ];

  return (
    <View className="w-full px-8 py-6">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between mb-6">
          {row.map((key, colIndex) => {
            if (key === 'empty') {
              return <View key={colIndex} className="w-20 h-20" />;
            }
            if (key === 'bio') {
              return (
                <TouchableOpacity 
                  key={colIndex} 
                  onPress={onBiometricPress}
                  className="w-20 h-20 rounded-full items-center justify-center bg-gray-50 active:bg-gray-200"
                >
                  <Fingerprint size={32} color="#DC2626" />
                </TouchableOpacity>
              );
            }
            if (key === 'delete') {
              return (
                <TouchableOpacity 
                  key={colIndex} 
                  onPress={onDelete}
                  className="w-20 h-20 rounded-full items-center justify-center bg-gray-50 active:bg-gray-200"
                >
                  <Delete size={32} color="#4B5563" />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity 
                key={colIndex} 
                onPress={() => onKeyPress(key)}
                className="w-20 h-20 rounded-full items-center justify-center bg-gray-50 border border-gray-100 shadow-sm active:bg-gray-200"
              >
                <Text className="text-3xl font-bold text-gray-800">{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};
