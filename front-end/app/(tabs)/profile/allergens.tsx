import React, { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Checkbox, Button } from 'react-native-ui-lib';
import { Allergies } from '@/constants/Allergies';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';

export default function AllergensScreen() {
    const { user } = useAuth();
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            
            const fetchAllergies = async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('allergies')
                    .eq('id', user.id)
                    .single();
            
                if (error) {
                    console.log('error getting user allergies')
                    console.log(error);
                } else {
                    console.log('successfully pulled');
                    console.log(data.allergies)
                    setSelectedAllergies(data.allergies || []);
                }
            };
        
            fetchAllergies();
        }, [user])
    );
      


    const toggleAllergy = (value: string) => {
        setSelectedAllergies((prev) =>
        prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
    };

    const handleSave = async () => {
        const { data, error } = await supabase
            .from('users')
            .update({ allergies: selectedAllergies })
            .eq('id', user.id);
        if (error) {
            console.log(error)
        } else {
            Alert.alert('Allergens saved');
        }
    }

    return (
        <SafeAreaView className="flex-1">
            <View className='mx-[40px] mt-[40px]'>
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
                <Text className="mt-5 text-lg font-bold pb-[20px]">
                    Selected Allergies: {selectedAllergies.join(', ')}
                </Text>
                
            </View>
            <View
                className="absolute bottom-[25px] left-6 right-6 py-3 px-6"
            >
                <Button className="bg-[#5BD9C2] w-full" label="Save" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
}
