import { View, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileItem from '@/components/ProfileItem';

export default function ProfileScreen() {
    const router = useRouter();
    return (
        <SafeAreaView className='flex-1 items-center w-full px-[90px]]'>
            <Text className='text-[48px]'>Profile</Text>
            <View className='flex flex-col gap-[50px] w-full bg-white'>
                <ProfileItem 
                    title='Medications'
                    icon='document-text-outline'
                    onPress={() => {router.push('/(tabs)/profile/AllMedicationsScreen')}}
                />
                <ProfileItem 
                    title='Allergens'
                    icon='document-text-outline'
                    onPress={() => {router.push('/profile/allergens')}}
                />
                <ProfileItem 
                    title='Documents'
                    icon='document-text-outline'
                    onPress={() => {router.push('/profile/documents')}}
                />
                <ProfileItem 
                    title='Logout'
                    icon='exit-outline'
                    onPress={() => {router.push('/')}}
                />
            </View>
        </SafeAreaView>
    );
};