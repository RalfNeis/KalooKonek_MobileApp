import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useUserStore } from '../store/useUserStore';

export function GlobalText({ style, ...props }: TextProps) {
  // 1. Grab the live text scale from your Zustand store
  const textScale = useUserStore((state) => state.textScale);

  // 2. Flatten the styles to find the exact font size NativeWind applied
  const flatStyle = StyleSheet.flatten(style) || {};
  
  // 3. React Native's default font size is 14 if nothing is explicitly set
  const baseFontSize = flatStyle.fontSize || 14;

  return (
    <RNText 
      {...props} 
      style={[
        style, 
        // 4. Override the font size with the scaled version!
        { fontSize: baseFontSize * textScale } 
      ]} 
    />
  );
}