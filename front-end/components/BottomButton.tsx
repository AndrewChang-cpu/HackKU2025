import { View, Text, Button  } from 'react-native-ui-lib';

interface BottomButtonProps {
    label: string;
};

export default function BottomButton({ label }: BottomButtonProps) {
    <View className='absolute w-full h-full px-[25px] pb-[50px]'>
        <View className="flex-1 justify-end">
            <Button
                label={label}
                enableShadow
            />
        </View>
    </View>
};