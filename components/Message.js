import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, Image, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';





const Message = ({ message }) => {

	const copyToClipboard = async  () => {
        if (Platform.OS == 'ios'){
            await Clipboard.setStringAsync(message.text);
        } else {
            await Clipboard.setStringAsync(message.text);
		    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
        }
		
	};

    console.log(message.user.name === 'you')

	return (
		<View style={ message.user.name === 'You' ? styles.messageyou : styles.messagechatgpt }>
			<View style={styles.profile}>
				<Image style={styles.Image} source={message.user.avatar } />
				<Text style={styles.author}>{message.user.name}</Text>
			</View>
			<TouchableOpacity onPress={() => copyToClipboard()}>
				<Text style={styles.text}>{message.text}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Message;

const styles = StyleSheet.create({
	messagechatgpt: {
		backgroundColor: '#122f3e',
		padding: 10,
		margin: 10,
		borderRadius: 10,
        //marginRight: "10%"
	},
	messageyou: {
		backgroundColor: '#285B7A',
		padding: 10,
		margin: 10,
		borderRadius: 10,
		alignSelf: 'flex-end',
	},
	text: {
		color: '#fff',
		fontSize: 16,
		alignSelf: 'flex-end',
	},
	profile: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	author: {
		color: '#fff',
		fontSize: 12,
		marginLeft: 8,
	},
	Image: {
		width: 25,
		height: 25,
		borderRadius: 8,
	},
});