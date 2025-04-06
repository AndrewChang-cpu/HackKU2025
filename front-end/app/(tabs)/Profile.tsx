import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';

export default function Profile() {
  const { user } = useAuth(); // Access the user from AuthContext
  const [name, setName] = useState('User'); // Default to 'User'
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function timeToDate(time) {
    return dayjs(`1970-01-01T${time}`)
  }

  useEffect(() => {
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
        try {
          const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          // Add a local 'taken' flag to each medication
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
  }, [user]);

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
      <Text className="text-3xl font-bold mb-4">Hi {name}!</Text>

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
            className={`mb-3 rounded-md ${med.taken ? 'bg-gray-300' : 'bg-white shadow-md'}`}
          >
            <View className="flex-row items-center p-4">
              {/* Increased width of the left view */}
              <View className="w-[100px] items-center pr-2">
                <Text className="text-xl font-bold">
                  {timeToDate(med.time).format('h:mm A')}
                </Text>
              </View>
              <View className="w-[1px] bg-gray-300 h-full mx-2" />
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
