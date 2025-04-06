import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileItemProps {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

export default function ProfileItem({ title, icon, onPress }: ProfileItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md"
    >
      <View className="flex-row items-center space-x-3">
        <Ionicons name={icon} size={28} color="black" />
        <Text className="text-lg">{title}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={28} color="black" />
    </TouchableOpacity>
  );
}
