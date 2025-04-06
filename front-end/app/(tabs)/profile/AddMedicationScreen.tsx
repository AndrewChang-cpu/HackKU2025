import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback
  } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import DateTimePicker from '@react-native-community/datetimepicker';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function AddMedicationScreen() {
  // const openai = async() => {
    
  // }
  // openai();


  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams(); // Replace useRoute with useLocalSearchParams

  const [time, setTime] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyDetails, setFrequencyDetails] = useState<any>(null);
  const [initialized, setInitialized] = useState(false); // Track initialization

  useFocusEffect(
    useCallback(() => {
      if (!initialized) {
        if (params?.scanned) {
          setName(String(params.scanned));
        }

        if (params?.frequencyDetails) {
          setFrequencyDetails(JSON.parse(String(params.frequencyDetails)));
          console.log("RECEIVED Frequency details:", params.frequencyDetails);
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

        setInitialized(true); // Mark as initialized
      }
    }, [params, initialized])
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


  async function getCombinedMedicationsAndAllergies(): Promise<string> {
    try {
      const userId = user?.id;
      // Fetch medications
      const { data: medications, error: medError } = await supabase
        .from('medications')
        .select('name')
        .eq('user_id', userId);
  
      if (medError) throw medError;
  
      // Fetch allergies
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('allergies')
        .eq('id', userId)
        .single();
  
      if (userError) throw userError;
  
      const medNames = medications?.map((m) => m.name) ?? [];
      const allergyList = userData?.allergies ?? []; // Assuming allergies is a string[] or null
  
      return [...medNames, ...allergyList].filter(Boolean).join(', ');
    } catch (err) {
      console.error('Error combining medications and allergies:', err);
      return '';
    }
  }


  const handleCancel = () => {
    router.push("/(tabs)/profile");
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
    const timeString = dayjs(time).format("HH:mm:ss"); // Store as "08:30", "14:00", etc.

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
        time: timeString,
      },
    ]);
  
    if (error) {
      console.error("Supabase insert error:", error);
      alert("Failed to save medication.");
    } else {
      console.log("Medication saved successfully.");
      
      // HERE
      try {
        let prompt = `here's a list of medications and allergies. give me a concise list of any pairs that pose a conflict--no other output. the output list should have two of the mentioned medications/allergies separated by a comma and no spaces; the pairs should be separated by lines. output "None" if there are no conflicts: `
        prompt += await getCombinedMedicationsAndAllergies()
        console.log('Prompt:', prompt);

        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${"API_KEY"}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant that suggests possible interactions between medications.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        });
  
        const json = await chatResponse.json();
        const responseText = json.choices?.[0]?.message?.content || '';
        console.log('ChatGPT response:', responseText, json);
        const interactions: [string, string][] = responseText
          .split('\n')
          .filter(line => line.includes(','))
          .map(line => {
            const [med1, med2] = line.split(',').map(s => s.trim());
            return [med1, med2] as [string, string];
          });
  
        console.log('Parsed interactions:', interactions);
        
        const conflictMap: Record<string, Set<string>> = {};

      // Step 1: Create a map of conflicts
      for (const [a, b] of interactions) {
        if (!conflictMap[a]) conflictMap[a] = new Set();
        if (!conflictMap[b]) conflictMap[b] = new Set();
        conflictMap[a].add(b);
        conflictMap[b].add(a);
      }

      // Step 2: Fetch all user medications
      const { data: meds, error } = await supabase
        .from('medications')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching medications:', error);
        return;
      }

      // Step 3: Loop through and update each medication with its conflicts
      for (const med of meds) {
        const conflicts = conflictMap[med.name];

        if (conflicts) {
          const { error: updateError } = await supabase
            .from('medications')
            .update({ conflicting_medication: Array.from(conflicts) })
            .eq('id', med.id);

          if (updateError) {
            console.error(`Failed to update ${med.name}:`, updateError);
          }
        }
      }
      } catch (e) {
        console.error('Error calling ChatGPT:', e);
      }


      router.push("/(tabs)/profile");
    }
  };

  return (
    <KeyboardAvoidingView
    className="flex-1 bg-white"
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={80} // Adjust based on header height
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: "center" }}>
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
          name,
          dosage,
          description,
        },
        })
      }
      >
      <Text>{formatFrequencySummary()}</Text>
      </Pressable>

      <Text className="text-lg font-semibold mb-1">Time of Day</Text>
      <View className="border border-gray-300 rounded px-3 py-2 mb-10 bg-white">
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(_, selectedTime) => {
        if (selectedTime) setTime(selectedTime);
        }}
      />
      </View>


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
        className="bg-[#5BD9C2] px-5 py-2 rounded-full"
      >
        <Text className="text-white font-semibold text-lg">Done</Text>
      </Pressable>
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
