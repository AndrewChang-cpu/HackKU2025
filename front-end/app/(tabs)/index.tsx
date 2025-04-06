import { useRoute, useFocusEffect  } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';

export default function DashboardScreen() {
  const { user } = useAuth(); // Access the user from AuthContext
  const [name, setName] = useState('User'); // Default to 'User'
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function timeToDate(time) {
    return dayjs(`1970-01-01T${time}`)
  }

  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('first_name')
            .eq('id', user.id)
            .single();
  
          if (error) {
            console.error('Error fetching user name:', error);
          } else {
            setName(data?.first_name || 'User');
          }
        }
      };
  
      const fetchMedications = async () => {
        if (user) {
          setLoading(true); // Ensure loading state on every focus
          try {
            const { data, error } = await supabase
              .from('medications')
              .select('*')
              .eq('user_id', user.id);
  
            if (error) throw error;
  
            const medsWithTaken = data.map((med) => ({
              ...med,
              taken: false,
            }));
  
            setMedications(medsWithTaken);
          } catch (err) {
            console.error('Error fetching medications:', err);
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchUserName();
      fetchMedications();
    }, [user])
  );

  function getTodaysMedications() {
    const today = dayjs().format('YYYY-MM-DD');

    const filtered = medications.filter((med) =>
      med.dates?.some((date: string) =>
        dayjs(date).isSame(today, 'day') // Compare the date ignoring the time
      )
    );

    const sorted = filtered.sort((a, b) => {
      if (a.taken && !b.taken) return 1;
      if (!a.taken && b.taken) return -1;
      return dayjs(timeToDate(a.time)).isAfter(dayjs(timeToDate(b.time))) ? 1 : -1;
    });
    console.log('FILETERED', filtered);
    return sorted;
  }

  function getNextUpcoming() {
    const now = dayjs();
    console.log(now)
    const todaysMeds = getTodaysMedications();
    return todaysMeds[0];
  }

  function handleToggleMedication(medId: string) {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medId ? { ...med, taken: !med.taken } : med
      )
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#e3fcef] px-4 pt-16">
        {/* Skeleton header */}
        <View className="absolute z-20 top-[65px] left-[50px] right-6 py-3 px-6">
          <View className="h-8 w-1/2 bg-gray-300 rounded" />
        </View>
  
        {/* Skeleton for the upcoming medication card */}
        <View className="mb-6 bg-white rounded-md p-4 shadow-md">
          <View className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
          <View className="h-6 bg-gray-300 rounded w-1/2 mb-2" />
          <View className="h-4 bg-gray-300 rounded w-1/3" />
        </View>
  
        {/* Skeleton for medication list */}
        <ScrollView className="mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} className="mb-3 bg-white rounded-md p-4 shadow-md">
              <View className="flex-row items-center">
                <View className="w-[100px] h-6 bg-gray-300 rounded mr-2" />
                <View className="flex-1">
                  <View className="h-6 bg-gray-300 rounded mb-2" />
                  <View className="h-6 bg-gray-300 rounded" />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  const nextMed = getNextUpcoming();
  const todaysMeds = getTodaysMedications();

  return (
    <View className="flex-1 bg-[#e3fcef] px-4 pt-16">
      <View
        className="absolute z-20 top-[65px] left-[50px] right-6 py-3 px-6"
      >
        <Text className="text-3xl font-bold mb-4">Hi {name}!</Text>
      </View>
      <View>
          <Image
            source={require('../../assets/goose/goose-speech.png')}
            //style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
      </View>
      {nextMed ? (
        <View className="mb-6 bg-white rounded-md p-4 shadow-md">
          <Text className="text-lg font-semibold mb-1">Next Medication</Text>
          <Text className="text-base font-bold">{nextMed.name}</Text>
          <Text className="text-sm text-gray-700 mb-1">
            {nextMed.dosage} • {timeToDate(nextMed.time).format('h:mm A')}
          </Text>
          <Text className="text-xs text-gray-500">NDC: {nextMed.ndc}</Text>
          <Text className="text-sm text-gray-600">{nextMed.description}</Text>
        </View>
      ) : (
        <View className="mb-6 bg-white rounded-md p-4 shadow-md">
          <Text className="text-lg font-semibold mb-1">No upcoming meds!</Text>
        </View>
      )}

      <Text className="text-xl font-bold mb-2">My Medications</Text>

      <ScrollView className="mb-4">
      {todaysMeds.map((med) => (
  <TouchableOpacity
    key={med.id}
    onPress={() => handleToggleMedication(med.id)}
    className={`mb-3 rounded-md ${med.taken ? 'bg-gray-300' : 'bg-white shadow-md'}`}
  >
    <View className="flex-row items-center p-4">
      {/* Time column */}
      <View className="w-[100px] items-center pr-2">
        <Text className="text-xl font-bold">
          {timeToDate(med.time).format('h:mm A')}
        </Text>
      </View>
      <View className="w-[1px] bg-gray-300 h-full mx-2" />
      {/* Main info and conflict info in a row */}
      <View className="flex-1 flex-row justify-between">
        {/* Left: Medication details */}
        <View className="flex-1">
          <Text className="text-base font-bold">{med.name}</Text>
          <Text className="text-sm text-gray-700">{med.dosage}</Text>
          {med.taken && (
            <Text className="text-green-700 font-bold mt-1">Taken</Text>
          )}
        </View>
        {/* Right: Conflicting medicine info */}
        {console.log(med.conflicting_medication)}
        {med.conflicting_medication && (
          <View className="ml-4 items-end">
            <Text className="text-sm font-bold text-red-600">Conflicts:</Text>
            <Text className="text-xs text-red-600">
              {med.conflicting_medication.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
))}
      </ScrollView>
    </View>
  );
}
