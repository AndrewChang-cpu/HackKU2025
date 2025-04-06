import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileItemProps {
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => {};
}

export default function ProfileItem({ title, icon, onPress }: ProfileItemProps) {
    return (
        <TouchableOpacity
            className='flex flex-row justify-between py-[10px] bg-white'
            onPress={onPress}
        >
            <View className='flex flex-row gap-2 justify-center items-center'>
                <View className=''>
                    <Ionicons name={icon} size={28} color='black'/>
                </View>
                <Text>{title}</Text>
            </View>
            <View className=''>
                <Ionicons name='chevron-forward-outline' size={28} color='black'/>
            </View>
        </TouchableOpacity>
    );
};