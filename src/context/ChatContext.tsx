import React, { createContext, useState, useContext } from 'react';
import { ChatRoom } from '../apis/chatApi';

interface MyComponentProps {
    children: React.ReactNode;
}

interface ChatContextState {
    currentChatRoom: ChatRoom;
    chatRooms: ChatRoom[];
    setCurrentChatRoom: (newChatRoom: ChatRoom) => void; 
    setChatRooms: (newChatRooms: ChatRoom[]) => void;
}

const ChatContext = createContext<ChatContextState>({
    currentChatRoom: {chatRoomId: 0, chatRoomName: '', chattersCount: 0, messages:[], unReadCount:0},
    chatRooms: [],
    setCurrentChatRoom: () => {},
    setChatRooms: () => {}
});

const ChatProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [chatRoomId, setChatRoomId] = useState<number>(0);
  const [chatRoomName, setChatRoomName] = useState<string>("");
  const [chattersCount, setChattersCount] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom>({chatRoomId: 0, chatRoomName: '', chattersCount: 0, messages:[], unReadCount:0});

 
  const updateCurrentChatRoom = (newChatRoomSummary: ChatRoom) => {
    setCurrentChatRoom(newChatRoomSummary);
  };

  const updateChatRooms = (newChatRooms: ChatRoom[]) => {
    setChatRooms(newChatRooms);
  };

  return (
    <ChatContext.Provider value={{
       currentChatRoom, chatRooms,
       setCurrentChatRoom: updateCurrentChatRoom,
       setChatRooms: updateChatRooms}}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = (): ChatContextState => {
  return useContext(ChatContext);
};

export { ChatProvider, useChatContext };
