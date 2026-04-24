import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RootIndex() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if the user is already logged in when the app opens
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

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

  // If they are logged in, let them into the Dashboard!
  return <Redirect href="/(tabs)" />;
}