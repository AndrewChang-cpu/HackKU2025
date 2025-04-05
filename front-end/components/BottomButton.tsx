import { View, Button  } from 'react-native-ui-lib';

interface BottomButtonProps {
    label: string;
};

export default function BottomButton({ label }: BottomButtonProps) {
    return (
        <View className='absolute w-full h-full px-[25px] pb-[50px]'>
            <View className="flex-1 justify-end">
                <Button
                    className='bg-button'
                    label={label}
                    style={{ backgroundColor: '#5BD9C2' }}
                />
            </View>
        </View>
    );
};