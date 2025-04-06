import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';

export default function AllMedicationsScreen() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchMedications = async () => {
        if (!user) return;
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to fetch medications:', error);
        } else {
          setMedications(data);
        }
      };

      fetchMedications();
    }, [user])
  );

  const formatFrequency = (med: any) => {
    if (!med.days || !med.time) return '—';
    const dayStr = med.days.join(', ');
    const timeStr = dayjs(`1970-01-01T${med.time}`).format('h:mm A');
    return `${dayStr} at ${timeStr}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (medId: string) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("medications")
              .delete()
              .eq("id", medId);

            if (error) {
              console.error("Error deleting medication:", error);
              alert("Failed to delete medication.");
            } else {
              setMedications((prev) => prev.filter((med) => med.id !== medId));
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold mb-4">All Medications</Text>

      <ScrollView className="mb-6">
        {medications.length === 0 ? (
          <Text className="text-gray-500">No medications found.</Text>
        ) : (
          medications.map((med) => {
            const isExpanded = expandedId === med.id;
            return (
              <TouchableOpacity
                key={med.id}
                onPress={() => toggleExpand(med.id)}
                className="mb-3 p-4 rounded-md bg-[#e3fcef] border border-green-200"
              >
                <Text className="text-lg font-bold">{med.name}</Text>
                <Text className="text-sm text-gray-700">{med.dosage}</Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {formatFrequency(med)}
                </Text>

                {isExpanded && (
                  <>
                    <View className="h-[1px] bg-gray-300 my-2" />
                    <Text className="text-sm text-gray-700 mb-3">
                      {med.description || 'No description.'}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(med.id)}
                      className="bg-red-600 px-4 py-2 rounded-full items-center self-start"
                    >
                      <Text className="text-white font-semibold text-sm">
                        Delete
                      </Text>
                    </Pressable>
                  </>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/(tabs)/profile/AddMedicationScreen')}
        className="bg-[#5BD9C2] py-3 rounded-full items-center"
      >
        <Text className="text-white text-lg font-semibold">+ Add Medication</Text>
      </Pressable>
    </View>
  );
}
