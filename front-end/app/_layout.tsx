import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { UserProvider, useAuth } from '@/contexts/UserContext';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component wraps your app and redirects based on authentication state.
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Adjust this if you have a dedicated folder for auth screens (e.g., (auth))
  const inAuthGroup = segments[0] === '(tabs)';

  useEffect(() => {
    if (!loading) {
      if (!user && !inAuthGroup) {
        // Redirect to welcome screen if not authenticated and not already in the auth group
        router.replace('/');
      } else if (user && inAuthGroup) {
        // Redirect to main app screen if authenticated but on an auth-only route
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, inAuthGroup, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <AuthWrapper>
        <View className="flex-1">
          <Slot />
        </View>
      </AuthWrapper>
    </UserProvider>
  );
}
