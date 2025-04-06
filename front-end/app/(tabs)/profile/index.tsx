import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileItem from '@/components/ProfileItem';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      if (!user || !user.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('first_name')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Error fetching user name:', error);
      } else {
        setName(data.first_name);
      }
    };
    fetchName();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
    } else {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#e3fcef] px-4 py-4">
      <Text className="text-4xl font-bold text-center mb-8 mt-[20px]">{name}</Text>
      <View className="rounded-[20px] gap-[20px] mx-[20px] bg-white p-4">
        <ProfileItem 
          title="Medications"
          icon="document-text-outline"
          onPress={() => router.push('/(tabs)/profile/AllMedicationsScreen')}
        />
        <ProfileItem 
          title="Allergens"
          icon="document-text-outline"
          onPress={() => router.push('/profile/allergens')}
        />
        <ProfileItem 
          title="Documents"
          icon="document-text-outline"
          onPress={() => router.push('/profile/documents')}
        />
        <ProfileItem 
          title="Logout"
          icon="exit-outline"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}
