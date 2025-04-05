import { View, Button } from 'react-native-ui-lib';

interface BottomButtonProps {
  label: string;
}

export default function BottomButton({ label }: BottomButtonProps) {
  return (
    <View className="absolute left-[25px] right-[25px] bottom-[50px] z-10">
      <Button
        className="bg-[#5BD9C2]"
        label={label}
      />
    </View>
  );
}
