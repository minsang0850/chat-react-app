import React, { useEffect, useState } from 'react';
import { getChatRoomList, ChatRoom, Message } from '../apis/chatApi';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from './ChatContext';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const ChatRoomList = (
  // {memberNo }: {memberNo: number }
  ) => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const { chatRoomId, setChatRoomId } = useChatContext();
    const { chatRoomName, setChatRoomName } = useChatContext();
    const { chattersCount, setChattersCount } = useChatContext();
    const [clients, setClients] = useState<Client[]>([]);
    let memberNo = 1;
    const navigate = useNavigate();

    useEffect(() => {
        getChatRoomList(memberNo)
        .then(data=>{
            setChatRooms(data);
            })
            .catch(error => {
              console.error('API 호출 오류:', error);
            });
    }, [chatRoomId]);

    useEffect(() => {
      if(chatRooms.length!=0){
        clients.map(stompClient=>{
          console.log("stomp deactivate");
          stompClient.deactivate();
        });
        setClients([]);
        chatRooms.map((room)=>{
          const socket = new SockJS('http://localhost:8080/stomp/chat');
          let stompClient = new Client({ webSocketFactory: () => socket });
          stompClient.onConnect = () => {
            //채팅방 들어갔다 올 때 마다 소켓이 재연결
            console.log("소켓 연결 room id:" + room.chatRoomId);
            stompClient.subscribe('/sub/chat/room/'+room.chatRoomId, (message: IMessage) => {
              const receiveMessage = JSON.parse(message.body) as Message;
              updateLastMessage(receiveMessage)
            });
          };
          stompClient.activate();
          addClient(stompClient);
        });
      }
  }, [chatRooms]);

  const addClient = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
  }

  const updateLastMessage = (reveivedMessage: Message) => {
    console.log("updateMessage: " + reveivedMessage.text);
    let roomToUpdate = chatRooms.find(room=>room.chatRoomId===reveivedMessage.chatRoomId);
    if (roomToUpdate) {
      roomToUpdate.latestMessage=reveivedMessage;
    }
  }

      const handleChatRoomClick = (room: ChatRoom) => {
    // 클릭한 채팅방의 id를 받아와 URL을 구성하고 해당 URL로 이동함
    //navigate(`/chat/chatRooms/${roomId}/members/${memberNo}`);
    setChatRoomId(room.chatRoomId);
    setChatRoomName(room.chatRoomName);
    setChattersCount(room.chattersCount);
  };

    return (
      chatRoomId === 0 ?  
        <div
            style={{padding: '10px'}}
        >
            {chatRooms.length === 0 ? (
                <div/>
            ):(
            
                <List>
      {chatRooms.map((room) => (
        <ListItem button key={room.chatRoomId}
        onClick={() => handleChatRoomClick(room)}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={room.chatRoomName} secondary={room.latestMessage===null?"":room.latestMessage.text} />
            {room.unReadCount==0?<div/>:<Badge badgeContent={room.unReadCount} color="primary"/>}
        </ListItem>
      ))}
    </List>
            
            )
            }
        </div> : <div></div>
    );
}

export default ChatRoomList