import React, { createContext, useState, useContext } from 'react';
import { ChatRoom } from '../apis/chatApi';

interface MyComponentProps {
    children: React.ReactNode;
}

interface ChatContextState {
    chatRoomId: number;
    chatRoomName: string;
    chattersCount: number;
    chatRooms: ChatRoom[];
    setChatRoomId: (newChatRoomId: number) => void;
    setChatRoomName: (newChatRoomName: string) => void;
    setChattersCount: (newChattersCount: number) => void;
    setChatRooms: (newChatRooms: ChatRoom[]) => void;
}

const ChatContext = createContext<ChatContextState>({
    chatRoomId: 0,
    chatRoomName: "",
    chattersCount: 0,
    chatRooms: [],
    setChatRoomId: () => {},
    setChatRoomName: () => {},
    setChattersCount: () => {},
    setChatRooms: () => {}
});

const ChatProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [chatRoomId, setChatRoomId] = useState<number>(0);
  const [chatRoomName, setChatRoomName] = useState<string>("");
  const [chattersCount, setChattersCount] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const updateChatRoomId = (newChatRoomId: number) => {
    setChatRoomId(newChatRoomId);
  };

  const updateChatRoomName = (newChatRoomName: string) => {
    setChatRoomName(newChatRoomName);
  };

  const updateChattersCount = (newChattersCount: number) => {
    setChattersCount(newChattersCount);
  };
  
  const updateChatRooms = (newChatRooms: ChatRoom[]) => {
    setChatRooms(newChatRooms);
  };

  return (
    <ChatContext.Provider value={{
       chatRoomId, chatRoomName, chattersCount, chatRooms,
       setChatRoomId: updateChatRoomId, 
       setChatRoomName: updateChatRoomName,
       setChattersCount: updateChattersCount,
       setChatRooms: updateChatRooms}}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = (): ChatContextState => {
  return useContext(ChatContext);
};

export { ChatProvider, useChatContext };
