import React, { useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { Checkbox } from 'react-native-ui-lib';
import { Allergies } from '@/constants/Allergies';

export default function AllergensScreen() {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const toggleAllergy = (value: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
        <SafeAreaView className="flex-1 p-4 px-[50px]">
        <Text className="text-xl font-bold mb-4">Select Your Allergies</Text>
        {Allergies.map((item) => (
            <View key={item.value} className="flex-row items-center mb-3">
            <Checkbox
                value={selectedAllergies.includes(item.value)}
                onValueChange={() => toggleAllergy(item.value)}
                color="blue"
            />
            <Text className="ml-2 text-base">{item.label}</Text>
            </View>
        ))}
        <Text className="mt-5 text-lg font-bold">
            Selected Allergies: {selectedAllergies.join(', ')}
        </Text>
        </SafeAreaView>
  );
}
