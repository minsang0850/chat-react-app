import React, { useEffect, useState, createContext, useContext } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoomComponent from '../components/ChatRoomComponent';
import ChatTopBar from '../components/ChatTopBar';
import { ChatProvider } from '../components/ChatContext';
import '../components/Message.css'; // 스타일 파일을 따로 생성

const ChatApp: React.FC = () => {

  const [isBannerVisible, setBannerVisible] = useState(true);

  const handleBanner = (booleanValue: boolean) => {
    setBannerVisible(booleanValue);
  };
  return (
    <div className={`floating-banner ${isBannerVisible ? 'visible' : 'hidden'}`}
      // style={{ width: '300px', height: '600px', position: 'fixed', 
      // bottom: '20px', right: '20px',
      // display: 'flex', flexDirection: 'column',
      // borderRadius: '30px',
      // border: '1px solid black'}}
      >
        <ChatProvider>
          <ChatTopBar
          visible={isBannerVisible}
          handleBanner={handleBanner}
          />
          <ChatRoomList />
          <ChatRoomComponent />
        </ChatProvider>
      </div>
  );
};

export default ChatApp;