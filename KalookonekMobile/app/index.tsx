import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GlobalText as Text } from '../components/GlobalText';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store';

export default function RootIndex() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in when the app opens
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hasPin = await SecureStore.getItemAsync('pin_enabled');
      setPinEnabled(hasPin === 'true');
      setSession(session);
      setIsReady(true);
    };

    initAuth();

    // Listen for logins and logouts
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Show a loading spinner while checking the database
  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-red-600">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // If no session is found, force them to the Login screen
  if (!session) {
    return <Redirect href="/login" />;
  }

  // If they have a PIN enabled, show the Quick Login screen
  if (pinEnabled) {
    return <Redirect href="/auth/pin-login" />;
  }

  // If they are logged in, let them into the Dashboard!
  return <Redirect href="/(tabs)" />;
}