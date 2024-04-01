import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGlobal } from './GlobalContext';

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

  useEffect(() => {
    if(user==null) {
        return;
    }
    const socket = new SockJS('http://localhost:8080/stomp/chat');
    const stompClient = new Client({ webSocketFactory: () => socket });


    stompClient.onConnect = (frame) => {
      // 연결 성공시 할 작업
      console.log('웹소켓 연결 - frame: '+ frame);
      stompClient.subscribe('/sub/members/'+user.memberNo, (message: IMessage) => {
        // const receiveMessage = JSON.parse(message.body) as Message;
        // updateLastMessage(receiveMessage)
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

  return (
    <WebSocketContext.Provider value={{ client }}>
      {children}
    </WebSocketContext.Provider>
  );
};