import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGlobal } from './GlobalContext';
import { Message ,ChatRoom} from '../apis/chatApi';
import { ChatContext } from './ChatContext';

interface WebSocketContextState {
  client: Client | null;
}

interface MyComponentProps {
    children: React.ReactNode;
}

const WebSocketContext = createContext<WebSocketContextState | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const { user, updateUser } = useGlobal();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom>({chatRoomId: 0, chatRoomName: '', chattersCount: 0, messages:[]});
  const chatContext = useContext(ChatContext);

  useEffect(() => {
    if(user==null) {
        return;
    }
    const socket = new SockJS('http://localhost:8080/stomp/chat');
    const stompClient = new Client({ webSocketFactory: () => socket });

    stompClient.onConnect = (frame) => {
      // 연결 성공시 할 작업
      stompClient.subscribe('/sub/members/'+user.memberNo, (message: IMessage) => {
        const receiveMessage = JSON.parse(message.body) as Message;
        addMessage(receiveMessage)
      });
    };

    stompClient.onStompError = (frame) => {
      // 에러 처리
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
        stompClient.deactivate();
    };
  }, [user]);

  useEffect(() => {
    if(chatContext==null){
      return;
    }
    setCurrentChatRoom(chatContext.currentChatRoom);
    setChatRooms(chatContext.chatRooms);
  }, [chatContext]);

  const addMessage = (reveivedMessage: Message) => {
    currentChatRoom.messages.push(reveivedMessage)
    console.log('currentChatRoom id:' + currentChatRoom.chatRoomId)
    chatContext.setCurrentChatRoom(currentChatRoom)
  }

  return (
    <WebSocketContext.Provider value={{ client }}>
      {children}
    </WebSocketContext.Provider>
  );
};