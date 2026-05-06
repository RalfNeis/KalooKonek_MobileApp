import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: StyleProp<ViewStyle>; // <-- Fixed typing here
}

export default function Skeleton({ width = '100%', height = 20, className, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[
        { opacity, width: width as any, height: height as any, backgroundColor: '#E5E7EB', borderRadius: 12 },
        style
      ]}
    />
  );
}