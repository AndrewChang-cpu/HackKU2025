import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function AddMedicationScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams(); // Replace useRoute with useLocalSearchParams

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyDetails, setFrequencyDetails] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (params?.scanned) {
        setName(String(params.scanned));
      }

      if (params?.frequencyDetails) {
        setFrequencyDetails(params.frequencyDetails);
      }

      if (params?.name !== undefined) {
        setName(String(params.name));
      }
      if (params?.dosage !== undefined) {
        setDosage(String(params.dosage));
      }
      if (params?.description !== undefined) {
        setDescription(String(params.description));
      }
    }, [params])
  );

  const formatFrequencySummary = () => {
    if (!frequencyDetails) return "Select frequency";

    const { every, unit, days, startDate, endDate } = frequencyDetails;

    const shortDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];

    const formatDate = (d: string | Date) =>
      new Date(d).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    let summary = `Every ${every} ${unit}${every !== "1" ? "s" : ""}`;

    if (unit === "week" && Array.isArray(days) && days.length > 0) {
      const dayLabels = days.map((d) => shortDays[d]).join(", ");
      summary += ` on ${dayLabels}`;
    }

    summary += ` ${start} - ${end}`;

    return summary;
  };

  const handleCancel = () => {
    router.push("/(tabs)");
  };

  const handleDone = async () => {
    const shortDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];
    if (!frequencyDetails) {
      alert("Please set frequency.");
      return;
    }

    const { every, unit, days, startDate, endDate } = frequencyDetails;

    if (!user) {
      alert("You must be signed in.");
      return;
    }

    // Generate all valid dates with 00:00:00 time
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).startOf('day');
    let generatedDates: string[] = [];

    if (unit === 'day') {
      let d = start;
      while (d.isSameOrBefore(end)) {
        generatedDates.push(d.toISOString());
        d = d.add(Number(every), 'day');
      }
    } else if (unit === 'week') {
      let weekStart = start;
      while (weekStart.isSameOrBefore(end)) {
        for (const dayIndex of days) {
          const offset = (dayIndex - weekStart.day() + 7) % 7;
          const target = weekStart.add(offset, 'day').startOf('day');
          if (target.isSameOrAfter(start) && target.isSameOrBefore(end)) {
            generatedDates.push(target.toISOString());
          }
        }
        weekStart = weekStart.add(Number(every), 'week');
      }
    }

    // Remove duplicates and sort
    const uniqueSortedDates = [...new Set(generatedDates)].sort();

    // Convert day indices to labels (e.g., 0 → "Su", 1 → "M", etc.)
    const dayLabels = Array.isArray(days)
      ? days.map((i: number) => shortDays[i])
      : [];

    console.log('inserting', {
      user_id: user.id,
      name,
      dosage,
      description,
      days: dayLabels,
      dates: uniqueSortedDates,
    });

    const { error } = await supabase.from("medications").insert([
      {
        user_id: user.id,
        name: name,
        dosage,
        description,
        days: dayLabels,
        dates: uniqueSortedDates,
      },
    ]);
  
    if (error) {
      console.error("Supabase insert error:", error);
      alert("Failed to save medication.");
    } else {
      console.log("Medication saved successfully.");
      router.push("/(tabs)");
    }
  };

  return (
    <View className="flex-1 px-6 py-8 bg-white">
      <Text className="text-2xl font-bold mb-4">Add Medication</Text>

      {/* Name Input & Scan Button */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Name</Text>
        <TouchableOpacity
          className="px-3 py-1 border border-gray-400 rounded"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/profile/CameraScreen",
              params: {
                name,
                dosage,
                description,
                frequencyDetails,
              },
            })
          }
        >
          <Text>Scan</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="e.g. Tylenol"
        value={name}
        onChangeText={setName}
      />

      {/* Frequency Selector */}
      <Text className="text-lg font-semibold mb-1">Frequency</Text>

      <Pressable
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/profile/Frequency",
            params: {
              frequencyDetails,
              name,
              dosage,
              description,
            },
          })
        }
      >
        <Text>{formatFrequencySummary()}</Text>
      </Pressable>

      {/* Dosage Input */}
      <Text className="text-lg font-semibold mb-1">Dosage</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-10"
        placeholder="e.g. 2 pills"
        value={dosage}
        onChangeText={setDosage}
      />

      {/* Description Input */}
      <Text className="text-lg font-semibold mb-1">Description</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-10"
        placeholder="e.g. Take with food"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Buttons */}
      <View className="flex-row justify-end space-x-6">
        <Pressable onPress={handleCancel} className="px-4 py-2">
          <Text className="text-gray-600 text-lg">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleDone}
          className="bg-green-600 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-semibold text-lg">Done</Text>
        </Pressable>
      </View>
    </View>
  );
}
