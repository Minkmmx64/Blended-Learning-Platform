import {
  StatusBar,
  Text,
  View,
  useColorScheme
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export function HomeScreen(): JSX.Element {
  
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };
  return (
    <>
      <StatusBar backgroundColor={ backgroundStyle.backgroundColor } />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>My Home Screen</Text>
      </View>
    </>
  );
}