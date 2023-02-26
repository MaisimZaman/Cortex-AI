import React from 'react';
import { StyleSheet, View, StatusBar, ImageBackground } from 'react-native';
import { SECONDARY_BG } from '../constants/BackgroundImage';



const Layout = ({children}) => {
	return (
		<ImageBackground  style={styles.image} source={  SECONDARY_BG}>
		<View style={styles.container}>
		<StatusBar 
			//backgroundColor={'#222f3e'} 
			barStyle={'light-content'} />
			{children}
		</View>
		</ImageBackground>
	);
};

export default Layout;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 35,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#222f3e',
	},
	image: {
        flex: 1,
        justifyContent: "center"
      },
});