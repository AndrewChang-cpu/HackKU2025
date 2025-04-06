import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import supabase from '@/api/supabaseClient';
import { useAuth } from '@/contexts/UserContext';

export default function DashbaordScreen() {
  const { user } = useAuth();
  console.log(user)
  if(!user) {
    console.log('NOOOOO')
  }
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');

    const dummyData = [
      {
        id: '1',
        user_id: 'dummy',
        name: 'Tylenol',
        dosage: '2 pills',
        ndc: '12345-6789',
        description: 'Used for pain relief',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 8).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '2',
        user_id: 'dummy',
        name: 'Vitamin D',
        dosage: '1 tablet',
        ndc: '55555-1234',
        description: 'Daily vitamin supplement',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 12).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '3',
        user_id: 'dummy',
        name: 'Amoxicillin',
        dosage: '500mg',
        ndc: '98765-4321',
        description: 'Antibiotic for infection',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 18).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '4',
        user_id: 'dummy',
        name: 'Melatonin',
        dosage: '5mg',
        ndc: '33333-7777',
        description: 'Helps with sleep',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 22).set('minute', 0).toISOString(),
        taken: false,
      },
    ];

    setMedications(dummyData);
    setLoading(false);
  }, []);

  function getTodaysMedications() {
    const today = dayjs().format('YYYY-MM-DD');

    const filtered = medications.filter((med) =>
      med.dates?.some((date: string) => dayjs(date).format('YYYY-MM-DD') === today)
    );

    const sorted = filtered.sort((a, b) => {
      if (a.taken && !b.taken) return 1;
      if (!a.taken && b.taken) return -1;
      return dayjs(a.time).isAfter(dayjs(b.time)) ? 1 : -1;
    });

    return sorted;
  }

  function getNextUpcoming() {
    const now = dayjs();
    const todaysMeds = getTodaysMedications();
    return todaysMeds.find((m) => !m.taken && dayjs(m.time).isAfter(now));
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
      <View className="flex-1 justify-center items-center">
        <Text>Loading medications...</Text>
      </View>
    );
  }

  const nextMed = getNextUpcoming();
  const todaysMeds = getTodaysMedications();

  return (
    <View className="flex-1 bg-[#e3fcef] px-4 pt-8">
      <Text className="text-3xl font-bold mb-4">Hi {user.name}</Text>

      {nextMed ? (
        <View className="mb-6 bg-white rounded-md p-4 shadow-md">
          <Text className="text-lg font-semibold mb-1">Next Medication</Text>
          <Text className="text-base font-bold">{nextMed.name}</Text>
          <Text className="text-sm text-gray-700 mb-1">
            {nextMed.dosage} • {dayjs(nextMed.time).format('h:mm A')}
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
      className={`mb-3 rounded-md ${
        med.taken ? 'bg-gray-300' : 'bg-white shadow-md'
      }`}
    >
      <View className="flex-row items-center p-4">
        {/* Time section */}
        <View className="w-[70px] items-center pr-2">
          <Text className="text-xl font-bold">
            {dayjs(med.time).format('hA')}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-[1px] bg-gray-300 h-full mx-2" />

        {/* Info section */}
        <View className="flex-1">
          <Text className="text-base font-bold">{med.name}</Text>
          <Text className="text-sm text-gray-700">{med.dosage}</Text>
          <Text className="text-xs text-gray-500 mb-1">NDC: {med.ndc}</Text>
          <Text className="text-sm text-gray-600">{med.description}</Text>
          {med.taken && (
            <Text className="text-green-700 font-bold mt-1">Taken</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>

    </View>
  );
}
