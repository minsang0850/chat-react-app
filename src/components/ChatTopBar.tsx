import React, { useEffect, useState, createContext, useContext } from 'react';
import { useChatContext } from './ChatContext';
import ChatRoomRegistBalloon from './ChatRoomRegistBalloon';
import ChatRoomExitBalloon from './ChatRoomExitBalloon';
import {IconButton} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ChatTopBarProps {
    visible: boolean;
    handleBanner: (visible: boolean) => void;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({visible, handleBanner}) => {

    const { chatRoomId, setChatRoomId } = useChatContext();
    const { chatRoomName, setChatRoomName } = useChatContext();
    const { chattersCount, setChattersCount } = useChatContext();
    const [roomRegistAnchor, setRoomRegistAnchor] = useState<HTMLElement | null>(null);
    const [roomExitAnchor, setRoomExitAnchor] = useState<HTMLElement | null>(null);

    const goBack = () => {
        setChatRoomId(0);
    };

    const handleClickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
        setRoomRegistAnchor(event.currentTarget);
    };
    
    const handleCloseAdd = () => {
        setRoomRegistAnchor(null);
    };

    const handleClickExit = (event: React.MouseEvent<HTMLButtonElement>) => {
        setRoomExitAnchor(event.currentTarget);
    };

    const handleCloseExit = () => {
        setRoomExitAnchor(null);
    };

    const clickHandleBanner = () => {
        handleBanner(!visible);
      };

    return <div style={{
            width: '100%', 
            height: '50px', 
            backgroundColor: '#964B00', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
        }}>
        <IconButton onClick={goBack}>
            <ArrowBackIosIcon/>
        </IconButton>
        <IconButton onClick={clickHandleBanner}>
            {visible?<ArrowDropDownIcon sx={{ fontSize: 40 }}/>
            : <ArrowDropUpIcon sx={{ fontSize: 40 }}/>}
        </IconButton>
        {chatRoomId ===0?<div></div>:
        <div style={{
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'end'
        }}>
            <div style={{fontWeight: 'bold', fontSize: '20px'}}>{chatRoomName}</div>
            <div style={{fontSize: '13px'}}>{chattersCount+'명'}</div>
        </div>}
        {chatRoomId ===0?
        <IconButton onClick={handleClickAdd}>
            <AddBoxIcon/>
        </IconButton>
        :
        <IconButton onClick={handleClickExit}>
            <LogoutIcon/>
        </IconButton>
        }
        <ChatRoomRegistBalloon
            anchorEl={roomRegistAnchor}
            onClose={handleCloseAdd}
        />
        <ChatRoomExitBalloon
            anchorEl={roomExitAnchor}
            onClose={handleCloseExit}
        />
    </div>;
}

export default ChatTopBar;
  

