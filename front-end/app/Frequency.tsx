import {
	View,
	Text,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
  } from "react-native";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import { useState, useEffect } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  
  export default function Frequency() {
	const navigation = useNavigation();
	const route = useRoute();
  
	// Restore passed data
	const initialFrequency = route.params?.frequencyDetails;
	const name = route.params?.name || "";
	const dosage = route.params?.dosage || "";
	const description = route.params?.description || "";
  
	const [repeatNum, setRepeatNum] = useState(initialFrequency?.every || "1");
	const [unit, setUnit] = useState<"day" | "week">(initialFrequency?.unit || "week");
	const [selectedDays, setSelectedDays] = useState<number[]>(
	  initialFrequency?.days || [6]
	);
	const [startDate, setStartDate] = useState(
	  initialFrequency?.startDate ? new Date(initialFrequency.startDate) : new Date()
	);
	const [endDate, setEndDate] = useState(
	  initialFrequency?.endDate ? new Date(initialFrequency.endDate) : new Date()
	);
  
	const toggleDay = (index: number) => {
	  setSelectedDays((prev) =>
		prev.includes(index)
		  ? prev.filter((d) => d !== index)
		  : [...prev, index]
	  );
	};
  
	const handleDone = () => {
	  const data = {
		every: repeatNum,
		unit,
		days: unit === "week" ? selectedDays : [],
		startDate,
		endDate,
	  };
  
	  navigation.navigate("AddMedicationScreen", {
		name,
		dosage,
		frequencyDetails: data,
		description
	  });
	};
  
	const handleCancel = () => {
	  navigation.goBack();
	};
  
	return (
	  <KeyboardAvoidingView
		behavior={Platform.OS === "ios" ? "padding" : "height"}
		style={{ flex: 1 }}
	  >
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		  <View
			className="flex-1 bg-white px-6"
			style={{ justifyContent: "center", alignItems: "center" }}
		  >
			<Text className="text-2xl font-bold mb-4">Set Frequency</Text>
  
			{/* Repeat Every */}
			<View className="mb-10">
			  <Text className="text-lg font-semibold mb-2">Repeat every</Text>
			  <View className="flex-row items-center space-x-3">
				<TextInput
				  className="w-16 border border-gray-300 rounded px-3 py-2 bg-white text-center text-base"
				  keyboardType="numeric"
				  value={repeatNum}
				  onChangeText={setRepeatNum}
				/>
				<TouchableOpacity
				  onPress={() => setUnit(unit === "week" ? "day" : "week")}
				  className="border border-gray-300 rounded px-4 py-2 bg-white"
				>
				  <Text className="text-base capitalize">{unit}</Text>
				</TouchableOpacity>
			  </View>
			</View>
  
			{/* Repeat On (if weekly) */}
			{unit === "week" && (
			  <View className="mb-10">
				<Text className="text-lg font-semibold mb-2">Repeat on</Text>
				<View className="flex-row justify-between">
				  {days.map((d, i) => (
					<Pressable
					  key={i}
					  onPress={() => toggleDay(i)}
					  className={`w-9 h-9 items-center justify-center rounded-full ${
						selectedDays.includes(i)
						  ? "bg-green-600"
						  : "bg-white border border-gray-300"
					  }`}
					>
					  <Text
						className={`text-base font-semibold ${
						  selectedDays.includes(i) ? "text-white" : "text-black"
						}`}
					  >
						{d}
					  </Text>
					</Pressable>
				  ))}
				</View>
			  </View>
			)}
  
			{/* Starts On */}
			<View className="mb-10">
			  <Text className="text-lg font-semibold mb-2">Starts on</Text>
			  <View className="rounded-md bg-white px-2 py-1">
				<DateTimePicker
				  value={startDate}
				  mode="date"
				  display="default"
				  onChange={(_, d) => d && setStartDate(d)}
				/>
			  </View>
			</View>
  
			{/* Ends On */}
			<View className="mb-10">
			  <Text className="text-lg font-semibold mb-2">Ends on</Text>
			  <View className="rounded-md bg-white px-2 py-1">
				<DateTimePicker
				  value={endDate}
				  mode="date"
				  display="default"
				  onChange={(_, d) => d && setEndDate(d)}
				/>
			  </View>
			</View>
  
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
		</TouchableWithoutFeedback>
	  </KeyboardAvoidingView>
	);
  }
  