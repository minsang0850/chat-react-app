import React, {useRef, useEffect} from 'react'
import { ChatRoom, Message } from '../apis/chatApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import {TextField} from '@mui/material';

const Messages = ({ messages, currentMemberNo, chattersCount }: { messages: Message[], currentMemberNo: number, chattersCount: number }) => {

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if(messageEndRef.current!=null){
      messageEndRef.current.scrollIntoView();
    }
    console.log('messages 개수 변화: ' + messages.length)
  }, [messages]);

    let renderMessage = (message: Message) => {
        const { chatRoomId, memberNo, memberName, text } = message;
        const isMessageFromMe = currentMemberNo === memberNo;
        return (
            <div>
                {isMessageFromMe?<MyMessageBox memberName={memberName} text={text} createDate={message.createdate}/>
                :<OtherMessage memberName={memberName} text={text}/>}
            </div>
        );
    };

    return (
        <div style={{ flex: 1, overflow: 'scroll' }}>
            {messages.map(renderMessage)}
            <div ref={messageEndRef}></div>
        </div>
    )
}


const MyMessageBox = ({ memberName, text, createDate}: {memberName: string, text: string, createDate:string}) => {
    return (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <div style={{
            flex: 1,
          }}/>
          <SideText
            // unreadCount={unreadCount}
            date={createDate}/>
          <div style={{
            flex: 3,
            borderStartStartRadius: 10,
            borderStartEndRadius: 10,
            borderEndStartRadius: 10,
            backgroundColor: '#50b8c2',
            padding: 5,
            margin: 5,
            fontSize: 14
          }}>
            {memberName+ ": " +text}
          </div>
        </div>
    );
  };

  const OtherMessage = ({ memberName, text}: {memberName: string, text: string}) => {
    return (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <div style={{
            flex: 3,
            borderStartEndRadius: 20,
            borderEndStartRadius: 20,
            borderEndEndRadius: 20,
            backgroundColor: '#cea1c4',
            padding: 5,
            margin: 5,
            fontSize: 10
          }}>
            {memberName+ ": " +text}
          </div>
          <div style={{
            flex: 1,
          }}>
  
          </div>
        </div>
    );
  };

  const SideText = ({  date}: {date: string}) => {
    return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          justifyContent: 'end',
          marginBottom: 10
        }}>
            <div style={{
              fontSize: 10
          }}>
            {/* {unreadCount} */}
            </div>
            <div style={{
              fontSize: 10
          }}>{date}</div>
        </div>
    );
  };


export default Messages