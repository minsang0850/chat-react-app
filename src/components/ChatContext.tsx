import React, { createContext, useState, useContext } from 'react';

interface MyComponentProps {
    children: React.ReactNode;
}

interface ChatContextState {
    chatRoomId: number;
    chatRoomName: string;
    chattersCount: number;
    setChatRoomId: (newChatRoomId: number) => void;
    setChatRoomName: (newChatRoomName: string) => void;
    setChattersCount: (newChattersCount: number) => void;
}

const ChatContext = createContext<ChatContextState>({
    chatRoomId: 0,
    chatRoomName: "",
    chattersCount: 0,
    setChatRoomId: () => {},
    setChatRoomName: () => {},
    setChattersCount: () => {}
});

const ChatProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [chatRoomId, setChatRoomId] = useState<number>(0);
  const [chatRoomName, setChatRoomName] = useState<string>("");
  const [chattersCount, setChattersCount] = useState<number>(0);

  const updateChatRoomId = (newChatRoomId: number) => {
    setChatRoomId(newChatRoomId);
  };

  const updateChatRoomName = (newChatRoomName: string) => {
    setChatRoomName(newChatRoomName);
  };

  const updateChattersCount = (newChattersCount: number) => {
    setChattersCount(newChattersCount);
  };

  return (
    <ChatContext.Provider value={{
       chatRoomId, chatRoomName, chattersCount, 
       setChatRoomId: updateChatRoomId, 
       setChatRoomName: updateChatRoomName,
       setChattersCount: updateChattersCount}}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = (): ChatContextState => {
  return useContext(ChatContext);
};

export { ChatProvider, useChatContext };
