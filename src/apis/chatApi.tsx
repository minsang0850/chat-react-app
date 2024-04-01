import axios from 'axios';

export interface ChatRoomWithMessages {
    chatRoom: ChatRoom;
    messages: Message[];
    member: Member;
}

export interface ChatRoom {
  chatRoomId: number;
  chatRoomName: string;
  messages: Message[];
  chattersCount: number;
}

export interface LatestMessage {
  chatRoomId: number;
  text: string;
  createdate: string;
}


export interface Message {
    chatRoomId: number;
    memberNo: number;
    memberName: string;
    text: string;
    createdate: string;
}

export interface Member {
  memberNo: number;
  memberName: string;
}

export interface ChatRooms{
  chatRoomDetails: ChatRoom[];
}

export async function getChatRoomData(chatRoomId:number ,memberNo:number): Promise<ChatRoomWithMessages> {
    try {
      const response = await axios.get<ChatRoomWithMessages>('http://localhost:8080/message/v1/chatRooms/'
      +chatRoomId, { params: {memberNo: memberNo}});
      const data = response.data as ChatRoomWithMessages;
      return data;
    } catch (error) {
      throw new Error('Fail get room data API call');
    }
};

export async function getChatRoomList(memberNo:number): Promise<ChatRoom[]> {
  try {
    const response = await axios.get<ChatRooms>('http://localhost:8080/message/v1/chatRooms'
    , { params: {memberNo: memberNo}});
    const data = response.data as ChatRooms;
    console.log('data:'+ data)
    console.log('' + data.chatRoomDetails[0].chatRoomId);
    return data.chatRoomDetails;
  } catch (error) {
    throw new Error('Fail get room List API call');
  }
};

export const postChatRoom = async(memberNo:number, chatRoomName:string, memberNos:number[]) => {
  try {
      const response = await axios.post('http://localhost:8080/message/v1/chatRooms', {
        memberNo: memberNo,    
        chatRoomName: chatRoomName,
        memberNos: memberNos,
      });
      return response.data;
  } catch (error){
      console.error('Fail getRecommendedReviews API call: ',error);
      return null;
  }
};

export const exitChatRoom = async(chatRoomId:number, memberNo:number) => {
  try {
      const response = await axios.post('http://localhost:8080/message/v1/chatRooms/' + chatRoomId + '/exit', {
        memberNo: memberNo
      });
      return response.data;
  } catch (error){
      console.error('Fail getRecommendedReviews API call: ',error);
      return null;
  }
};