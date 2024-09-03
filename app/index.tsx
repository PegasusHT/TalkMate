import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

const App = () => {
    return (
        <Redirect href='/(root)'></Redirect>
    )
}

export default App;