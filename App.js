import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Navigation from './components/Navigation';
import { MyTheme } from './styles/Styles';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={MyTheme}>
        <Navigation/>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

;
