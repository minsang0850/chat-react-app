import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { useParams } from "react-router-dom";
import { getChatRoomData,ChatRoom, ChatRoomWithMessages, Message, Member } from '../apis/chatApi';
import Messages from './Messages';
import {TextField, Button} from '@mui/material';
import { useChatContext } from './ChatContext';

interface ChatRoomParams {
    chatRoomIdString: string;
    memberNoString: string;
    [key: string]: string | undefined;
}

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

    const params = useParams<ChatRoomParams>();
    const memberNo = 1;
    const { chatRoomId, setChatRoomId } = useChatContext();
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [chatRoomData, setChatRoomData] = useState<ChatRoomWithMessages>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom>();
    const [member, setMember] = useState<Member>();
    const [memberName, setMemberName] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');
    const [chattersCount, setChattersCount] = useState<number>(0);

      useEffect(() => {
        if(chatRoomId===0){
          return;
        }
        getChatRoomData(chatRoomId, memberNo)
        .then(data=>{
          console.log(data);
            setChatRoomData(data);
        })
        .catch(error => {
          console.error('API 호출 오류:', error);
        });

        const socket = new SockJS('http://localhost:8080/stomp/chat');
        const stompClient = new Client({ webSocketFactory: () => socket });
    
        stompClient.onConnect = () => {
          console.log('웹소켓 연결 - chatRoomId: '+ chatRoomId);
          stompClient.subscribe('/sub/chat/room/'+chatRoomId, (message: IMessage) => {
            const receiveMessage = JSON.parse(message.body) as Message;
            addMessage(receiveMessage)
          });
          stompClient.subscribe('/sub/chat/enter', (message: IMessage) => {
            const receiveMessage = JSON.parse(message.body) as Message;
            addReaderNo(receiveMessage.memberNo);
          });
          enterChatRoom(stompClient);
        };
    
        stompClient.activate();
        setStompClient(stompClient);
    
        return () => {
          stompClient.deactivate();
        };
      }, [chatRoomId]);

      useEffect(() => {
        if(chatRoomData==undefined || chatRoomData==null){
          return;
        }
        setChatRoom(chatRoomData.chatRoom);
        setMessages(chatRoomData.messages);
        setMember(chatRoomData.member);
      }, [chatRoomData]);

      useEffect(() => {
        if(chatRoom==undefined || chatRoom==null){
          return;
        }
        setChattersCount(chatRoom.chattersCount);
      }, [chatRoom]);
    
      useEffect(() => {
        if(member==undefined || member==null){
          return;
        }
        setMemberName(member.memberName);
      }, [member]);

      const enterChatRoom = (stompClient:Client) => {
        if (stompClient && stompClient.connected) {
          console.log("enter chat room");
          const destination = '/pub/chat/enter';
          const requestData = new EnterData(chatRoomId, memberNo);
          stompClient.publish({ destination, body: JSON.stringify(requestData) });
        }
      };

      const sendMessage = () => {
        if (stompClient && stompClient.connected) {
          const destination = '/pub/chat/message';
          const requestData = new RequestMessage(chatRoomId, memberNo, memberName, inputText);
          console.log(requestData);
          stompClient.publish({ destination, body: JSON.stringify(requestData) });
          setInputText('');
        }
      };
    
      const addMessage = (reveivedMessage: Message) => {
        setMessages(prevMessages => [...prevMessages, reveivedMessage]);
      }

      const addReaderNo = (readerNo: number) => {
        const updatedMessages = [...messages];
        updatedMessages.map(message=>{
            if(!message.readerNos.includes(readerNo)){
              message.readerNos.push(readerNo);
            }
        })
        setMessages(updatedMessages);
      }

      return (
        chatRoomId!=0 ?
        <div
        style={{ display: 'flex', flexDirection: 'column', flex: '1', overflow: 'scroll'}}
          >
            <Messages
              messages={messages}
              currentMemberNo={memberNo}
              chattersCount={chattersCount}
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