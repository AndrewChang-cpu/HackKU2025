import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

// Uncomment and configure the following if/when using Supabase
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = 'https://your-project.supabase.co';
// const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
// const DUMMY_USER_ID = 'user-123';

export default function Profile() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');

    // ----------------------------
    // SUPABASE CODE (Commented out for now)
    // async function fetchMedications() {
    //   try {
    //     const { data, error } = await supabase
    //       .from('medications')
    //       .select('*')
    //       .eq('user_id', DUMMY_USER_ID);
    //     if (error) throw error;
    //     // Add a local 'taken' flag to each medication
    //     const medsWithTaken = data.map((med) => ({ ...med, taken: false }));
    //     setMedications(medsWithTaken);
    //   } catch (err) {
    //     console.error('Error fetching medications:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // fetchMedications();
    // ----------------------------
    
    const dummyData = [
      {
        id: '1',
        user_id: 'dummy',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 8).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '2',
        user_id: 'dummy',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 12).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '3',
        user_id: 'dummy',
        days: [],
        dates: [today],
        time: dayjs().set('hour', 18).set('minute', 0).toISOString(),
        taken: false,
      },
      {
        id: '4',
        user_id: 'dummy',
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
      <Text className="text-3xl font-bold mb-4">Hi Dummy Name!</Text>

      {nextMed ? (
        <View className="mb-6 bg-white rounded-md p-4 shadow-md">
          <Text className="text-lg font-semibold mb-1">Next Medication</Text>
          <Text className="text-base">
            Take at {dayjs(nextMed.time).format('h:mm A')}
          </Text>
          <Text className="text-sm text-gray-600">ID: {nextMed.id}</Text>
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
            className={`mb-3 rounded-md p-4 ${
              med.taken ? 'bg-gray-300' : 'bg-white shadow-md'
            }`}
          >
            <Text className="text-base font-semibold">
              {dayjs(med.time).format('h:mm A')}
            </Text>
            <Text className="text-sm text-gray-600">ID: {med.id}</Text>
            {med.taken && (
              <Text className="text-green-700 font-bold mt-1">Taken</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
