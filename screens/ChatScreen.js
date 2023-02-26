import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList, ImageBackground} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FontAwesome } from '@expo/vector-icons';
import Layout from '../components/Layouts';
import Message from '../components/Message';
import { Keyboard } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { db, auth } from '../services/firebase';
import { SECONDARY_BG } from '../constants/BackgroundImage';

const baseUrl = 'https://ask-me-anything-ehws.onrender.com/';
export default function ChatScreen() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([]);
  const [myMessages, setMyMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [allMessageChannels, setAllMessageChannels] = useState([])

  const flatListRef = useRef(null);

  useEffect(() => {
      db.collection('Users')
        .doc(auth.currentUser.uid)
        .collection('userChats')
        .orderBy('creation', 'desc')
        .onSnapshot((snapshot) => setAllMessageChannels(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
      }))))

  if (allMessageChannels != [] && allMessageChannels != undefined && allMessageChannels != null){
    //setMyMessages(allMessageChannels[0].data.messages)
    console.log(allMessageChannels)
  }

   
    
  }, [])

  useEffect( () => {
    if (allMessageChannels == []){
      db.collection('Users')
        .doc(auth.currentUser.uid)
        .collection("userChats")
        .add({
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          messages: messages
        })
    } else if (allMessageChannels[0] != undefined) {
      db.collection('Users')
        .doc(auth.currentUser.uid)
        .collection("userChats")
        .doc(allMessageChannels[0].id)
        .update({
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          messages: messages
        })
    }
        
},[messages])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardActive(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardActive(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
          flex: 1,
          paddingTop: 5,
          paddingBottom: 35,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#222f3e',
      },
      inputMessage: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          //marginBottom: 30
      
      },
      input: {
          width: '75%',
          height: 50,
          padding: 10,
          fontSize: 14,
          textAlign: 'center',
          color: '#ffffff',
          borderColor: '#10ac84',
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: '#222f3e',
          marginBottom: isKeyboardActive ? "180%" : "10%",
      //position: 'absolute',
      borderRadius: 30
      //bottom:   "45%",
      },
      button: {
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '15%',
          height: 50,
          marginLeft: 10,
          textAlign: 'center',
          borderColor: '#10ac84',
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: isKeyboardActive ? "180%" : "10%",
      borderRadius: 20,
          backgroundColor: '#10ac84',
      },
    listContainer: {
          flex: 1,
          width: '100%',
          backgroundColor: '#222f3e',
          marginBottom: 35,
          height: '50%'
      },
      image: {
        flex: 1,
        justifyContent: "center"
      },
  });

  


  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello, Can I Help You?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Cortex-AI',
          avatar: require('../assets/CortexAI.jpg'),
        },
      },
    ])
  }, [])


  useEffect(() => {
    const typingMessage = 'Typing...'
    if (isTyping){
      setMessages([...messages, 
        {
          _id: 1,
          text: typingMessage,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Cortex-AI',
            avatar: require('../assets/CortexAI.jpg'),
          },
        },
      ])
    } else {
      if (messages.length > 1){
        if (messages[messages.length-2].text == typingMessage){
          var cutMessages = messages
          cutMessages.splice(messages.length-2, 1)
          setMessages(cutMessages)
        }
      }
      
    }
    
  }, [isTyping])

  const onSend = useCallback(async (messages = []) => {
    const text = messages[0].text;
    if (text.toUpperCase() === 'CLEAR') {
      return setMessages([]);
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    setIsTyping(true);

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promtData: text }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const parsedData = data?.bot;
        const updatedData = parsedData.substring(parsedData.indexOf('\n') + 1);
        console.log(updatedData);

        const newMessage = {
          _id: data?._id,
          text: updatedData,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Cortex-AI',
            avatar:
              require('../assets/CortexAI.jpg'),
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessage),
        );
      }
      setIsTyping(false);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }, []);

  async function generateChatGPTOutput(text){
    setIsTyping(true);
    setText('')
    try {
      const myNewMessage = {
        _id: Math.random() * 1000,
        text: text,
        createdAt: new Date(),
        user: {
          _id:  Math.random() * 1000,
          name: 'You',
          avatar:
            {uri: 'https://www.freedomspromise.org/wp-content/uploads/2020/01/male-silluette.jpg'},
        },
      };

      setMyMessages([...myMessages, myNewMessage])
      setMessages([...messages, myNewMessage])
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promtData: text }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const parsedData = data?.bot;
        const updatedData = parsedData.substring(parsedData.indexOf('\n') + 1);
        console.log(updatedData);

        const newMessage = {
          _id: data?._id,
          text: updatedData,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Cortex-AI',
            avatar:
              require('../assets/CortexAI.jpg'),
          },
        };

        setMessages([...messages,  myNewMessage, newMessage])

        
      }
      
      setIsTyping(false);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  const handleContentSizeChange = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  function renderChatMessages(){
    return (
      <View style={{marginBottom:  isKeyboardActive ?  "90%" : '10%'}}>
			<FlatList
				style={styles.listContainer}
				data={messages}
                ref={flatListRef}
                onContentSizeChange={handleContentSizeChange}
                onLayout={handleContentSizeChange}
				renderItem={({ item }) => <Message message={item} />}
				keyExtractor={(item) => item._id.toString()}
				
			/>
		</View>
    )
  }

  
 
  



  return (
    
    <Layout>

      
      {renderChatMessages()}
    
    
      <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.inputMessage}>
        
   

        
        <TextInput
          style={styles.input}
          onChangeText={(text) => setText(text)}
          placeholder='Ask me anything'
          placeholderTextColor={"white"}
          keyboardAppearance='dark'
          value={text}
         
        onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity disabled={text == ''} style={styles.button} onPress={() => generateChatGPTOutput(text)}>
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      
      </KeyboardAvoidingView>
      
      
    </Layout>
   
  )
  



  
}

