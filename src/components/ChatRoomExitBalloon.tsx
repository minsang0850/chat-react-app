import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { Checkbox, FormControlLabel, Typography, Container } from '@mui/material';
import { exitChatRoom} from '../apis/chatApi';
import { useChatContext } from './ChatContext';


interface ChatRoomExitBalloonProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
  }
  
  const ChatRoomExitBalloon: React.FC<ChatRoomExitBalloonProps> = ({ anchorEl, onClose }) => {
    const { chatRoomId, setChatRoomId } = useChatContext();

    const exitRoom = () => {
        exitChatRoom(chatRoomId, 1)
        .then(()=>{
        setChatRoomId(0);
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