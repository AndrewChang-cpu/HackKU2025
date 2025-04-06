import { Text } from 'react-native'
import { View } from 'react-native-ui-lib';

interface HeadingProps {
    text: string;
};

export default function Heading({ text }: HeadingProps) {
    return (
        <Text className="text-[50px] text-cyan-500">{text}</Text>
    );
};