import { useState, useEffect } from 'react';
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
            const { data, error } = await supabase
                .from('users')
                .select('first_name')
                .eq('id', user.id)
                .single();
            if (error) {
                console.log(error);
            } else {
                setName(data.first_name);
            }
        };
        fetchName();
    }, [])

  return (
    <SafeAreaView className="flex-1 bg-[#e3fcef] px-[] py-4">
      <Text className="text-4xl font-bold text-center mb-8 mt-[20px]">{name}</Text>
      <View className="rounded-[20px] gap-[20px] mx-[20px] bg-white">
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
                    title='Documents'
                    icon='document-text-outline'
                    onPress={() => {router.push('/profile/documents')}}
                />

        <ProfileItem 
          title="Logout"
          icon="exit-outline"
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
