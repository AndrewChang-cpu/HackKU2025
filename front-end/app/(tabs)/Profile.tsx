import { View, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileItem from '@/components/ProfileItem';

export default function ProfileScreen() {
    const router = useRouter();
    return (
        <SafeAreaView className='flex-1 items-center w-full px-[90px]]'>
            <Text className='text-[48px]'>Profile Screens</Text>
            <View className='flex flex-col gap-[50px] w-full bg-white'>
                <ProfileItem 
                    title='Medical questions'
                    icon='document-text-outline'
                    onPress={() => {router.push('/')}}
                />
                <ProfileItem 
                    title='Update allergies'
                    icon='document-text-outline'
                    onPress={() => {router.push('/')}}
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