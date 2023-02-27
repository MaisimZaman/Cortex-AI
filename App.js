import React from 'react';
import { Text, TouchableOpacity, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import ChatScreen from './screens/ChatScreen';
import { auth } from './services/firebase';


const Stack = createNativeStackNavigator();

export default function App() {
	function signOutUser(navigation){
		Vibration.vibrate(50)
		
		  auth.signOut().then(() => {
			navigation.replace('LoginScreen')
		  })
	  }

	return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName='LoginScreen'>
				<Stack.Screen
					name="LoginScreen"
					component={Login}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="RegisterScreen"
					component={Register}
					options={{headerShown: false}}
				/>
					<Stack.Screen
						name="ChatScreen"
						component={ChatScreen}
						options={({ navigation }) => ({
							title: 'Cortex AI',
							headerStyle: { backgroundColor: '#222f3e' },
							headerTitleStyle: { color: '#fff' },
							headerTintColor: '#fff',
							headerRight: () => (
								<TouchableOpacity onPress={() => signOutUser(navigation)}>
									<Text style={{ color: '#fff', marginRight: 10 }}>Logout</Text>
								</TouchableOpacity>
							),
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
	);
}