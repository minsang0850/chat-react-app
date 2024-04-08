import React, { useEffect, useState, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { getChatRoomData,ChatRoom, ChatRoomWithMessages, Message, Member } from '../apis/chatApi';
import Messages from './Messages';
import {TextField, Button} from '@mui/material';
import { useChatContext } from '../context/ChatContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useGlobal } from '../context/GlobalContext';
import { ChatContext } from '../context/ChatContext';

class RequestMessage{
  chatRoomId: number;
  memberNo: number;
  memberName: string;
  text: string;

  constructor(chatRoomId: number, memberNo: number, memberName: string, text: string) {
    this.chatRoomId = chatRoomId;
    this.memberNo = memberNo;
    this.memberName = memberName;
    this.text = text;
  }
}

class EnterData {
  chatRoomId: number;
  memberNo: number;

  constructor(chatRoomId: number, memberNo: number) {
    this.chatRoomId = chatRoomId;
    this.memberNo = memberNo;
  }
} 

const ChatRoomComponent: React.FC = () => {

    const {client} = useWebSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const { user, updateUser } = useGlobal();
    const [memberNo, setMemberNo] = useState<number>(0);
    const [memberName, setMemberName] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom>({chatRoomId: 0, chatRoomName: '', chattersCount: 0, messages:[]});
    const chatContext = useContext(ChatContext);
    
      useEffect(() => {
        if(user==undefined || user==null){
          return;
        }
        setMemberName(user.memberName);
        setMemberNo(user.memberNo);
      }, [user]);

      useEffect(() => {
        if(currentChatRoom==null){
          return;
        }
        console.log('currentChatRoom Id: ' + currentChatRoom.chatRoomId)
      }, [currentChatRoom]);

      useEffect(() => {
        if(chatContext==null){
          return;
        }
        setCurrentChatRoom(chatContext.currentChatRoom);
        setChatRooms(chatContext.chatRooms);
        console.log('chatContext.currentChatRoom:' + chatContext.currentChatRoom.chatRoomId)
      }, [chatContext]);



      // const enterChatRoom = (stompClient:Client) => {
      //   if (stompClient && stompClient.connected) {
      //     console.log("enter chat room");
      //     const destination = '/pub/chat/enter';
      //     const requestData = new EnterData(currentChatRoom.chatRoomId, memberNo);
      //     stompClient.publish({ destination, body: JSON.stringify(requestData) });
      //   }
      // };

      const sendMessage = () => {
        if (client && client.connected) {
          const destination = '/pub/chat/message';
          const requestData = new RequestMessage(currentChatRoom.chatRoomId, memberNo, memberName, inputText);
          console.log('send message: ' + requestData);
          client.publish({ destination, body: JSON.stringify(requestData) });
          addMessage({chatRoomId: currentChatRoom.chatRoomId, memberNo:memberNo , memberName:memberName , text:inputText , createdate: ''});
          setInputText('');
        }
      };
    
      const addMessage = (reveivedMessage: Message) => {
        setMessages(prevMessages => [...prevMessages, reveivedMessage]);
      }

      return (
        currentChatRoom.chatRoomId!=0 ?
        <div
        style={{ display: 'flex', flexDirection: 'column', flex: '1', overflow: 'scroll'}}
          >
            <Messages
              messages={currentChatRoom.messages}
              currentMemberNo={memberNo}
              chattersCount={currentChatRoom.chattersCount}
            />
      <div style={{ 
        height: '60px',
        display: 'flex', flexDirection: 'row',
        bottom: 0,
        
        alignSelf: 'center', 
        width: '100%'}}>
        <div
        style={{
        // width: '100%',
        flex: 1
      }}>
      <TextField 
                style={{width:'100%'}}
                 placeholder="Write your message"
                 multiline
                 variant="filled"
                 value={inputText}
                 onChange={(event) => {
                   setInputText(event.target.value);
                 }}
      >
      </TextField>
      </div>
      <div>
      <Button
      variant="contained"
      onClick={sendMessage}>전송
      </Button>
      </div>
      </div>
        </div> : <div/>
      )
};

export default ChatRoomComponent;