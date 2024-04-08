import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { Checkbox, FormControlLabel, Typography, Container } from '@mui/material';
import { postChatRoom} from '../apis/chatApi';
import { useChatContext } from '../context/ChatContext';

interface ChatRoomRegistBalloonProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const ChatRoomRegistBalloon: React.FC<ChatRoomRegistBalloonProps> = ({ anchorEl, onClose }) => {

    const [selected, setSelected] = useState(false);
    const [friends, setFriends] = useState([
        { id: 2, label: '친구1', isChecked: false },
        { id: 3, label: '친구2', isChecked: false },
    ]);
    const [checkedFriends, setCheckedFriends] = useState<number[]>([]);
    const [chatRoomName, setChatRoomName] = useState<string>('');
    const { currentChatRoom, setCurrentChatRoom } = useChatContext();

    const handleItemChange = (itemId: number) => {
    setFriends(prevFriends =>
        prevFriends.map(friend =>
        friend.id === itemId
            ? { ...friend, isChecked: !friend.isChecked }
            : friend
        )
    );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatRoomName(event.target.value);
      };

    const selectFriends = () => {
        let checkedFriendNos: number[] = [];
        friends.forEach(friend => {
            if(friend.isChecked){
                checkedFriendNos.push(friend.id);
            }
        });
        if(checkedFriendNos.length==0){
            return;
        }
        setCheckedFriends(checkedFriendNos);
        setSelected(true);
    };

    const registChatRoom = async () => {
        const chatRoom = await postChatRoom(1, chatRoomName, checkedFriends);
        if(chatRoom==null){
            return;
        }
        currentChatRoom.chatRoomId=chatRoom.chatRoomId;
        setCurrentChatRoom(currentChatRoom);
        onClose();
    };

    return (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        { !selected?
         <Container style={{width: '200px', height:'400px', padding: '0', textAlign: "center", display: 'flex', flexDirection: 'column'}}>
      <h5>대화상대 선택</h5>
      <div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
      {friends.map(friend => (
        <label key={friend.id} className="custom-label">
        {friend.label}
        <Checkbox
          checked={friend.isChecked}
          onChange={() => handleItemChange(friend.id)}
        />
      </label>
      ))}
      </div>
      <div style={{width: '100%', height: '40px',display: 'flex', justifyContent: 'space-between', marginTop: 2, border: '1px solid #ccc'}}>
          <Button style= {{margin: '3px'}} variant="outlined" color="secondary" onClick={onClose}>
            취소
          </Button>
          <Button style= {{margin: '3px'}} variant="contained" color="primary" onClick={selectFriends}>
            확인
          </Button>
        </div>
    </Container>
: <Container style={{width: '200px', height:'400px', padding: '0', textAlign: "center", display: 'flex', flexDirection: 'column'}}>
    <h5>채팅방 이름 설정</h5>
    <div style={{flex: '1'}}>
    <input
        type="text"
        value={chatRoomName}
        onChange={handleInputChange}
        placeholder="채팅방 이름을 입력하세요"
      />
      </div>
      <div style={{width: '100%', height: '40px',display: 'flex', justifyContent: 'space-between', marginTop: 2, border: '1px solid #ccc'}}>
          <Button style= {{margin: '3px'}} variant="outlined" color="secondary" onClick={onClose}>
            취소
          </Button>
          <Button style= {{margin: '3px'}} variant="contained" color="primary" onClick={registChatRoom}>
            확인
          </Button>
        </div>
    </Container>}
      </Popover>
    );
  };
  
  export default ChatRoomRegistBalloon;
  