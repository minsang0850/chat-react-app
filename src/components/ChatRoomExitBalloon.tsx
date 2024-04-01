import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { Checkbox, FormControlLabel, Typography, Container } from '@mui/material';
import { exitChatRoom} from '../apis/chatApi';
import { useChatContext } from '../context/ChatContext';


interface ChatRoomExitBalloonProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
  }
  
  const ChatRoomExitBalloon: React.FC<ChatRoomExitBalloonProps> = ({ anchorEl, onClose }) => {
    const {currentChatRoom, setCurrentChatRoom} = useChatContext();

    const exitRoom = () => {
        exitChatRoom(currentChatRoom.chatRoomId, 1)
        .then(()=>{
        currentChatRoom.chatRoomId=0;
        setCurrentChatRoom(currentChatRoom);
        onClose();
      }
        )
    };

    return (
        <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        >
            <Button style= {{margin: '3px'}} variant="outlined" color="secondary" onClick={onClose}>
            취소
          </Button>
          <Button style= {{margin: '3px'}} variant="contained" color="primary" onClick={exitRoom}>
            확인
          </Button>
        </Popover>
    )
  };

  export default ChatRoomExitBalloon;