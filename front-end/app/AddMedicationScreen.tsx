import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function AddMedicationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [description, setDescription] = useState("");
  const [frequencyDetails, setFrequencyDetails] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.scanned) {
        setName(route.params.scanned);
      }

      if (route.params?.frequencyDetails) {
        setFrequencyDetails(route.params.frequencyDetails);
      }

      if (route.params?.name !== undefined) {
        setName(route.params.name);
      }
      if (route.params?.dosage !== undefined) {
        setDosage(route.params.dosage);
      }
    }, [route.params])
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
    navigation.goBack();
  };

  const handleDone = () => {
    const formData = {
      name,
      dosage,
      frequencyDetails,
    };
    console.log("Submit:", formData); // Replace with a call to Supabase or any handler
    navigation.goBack(); // Or navigate to confirmation screen
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
              pathname: "/(tabs)/CameraScreen",
              params: {
                name,
                dosage,
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
          navigation.navigate("Frequency", {
            frequencyDetails,
            name,
            dosage,
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
