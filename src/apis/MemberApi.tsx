import axios from 'axios';

export interface Member {
  memberNo: number;
  memberName: string;
}

export async function signUp(username:string, id:string, password:string) {
    try {
      const response = await axios.post<void>('http://localhost:8080/sign-up'
      , { params: {username:username, id:id, password:password}});
    } catch (error) {
      throw new Error('Fail get room data API call');
    }
};

export async function signIn(id:string, password:string): Promise<Member>  {
    try {
      const response = await axios.post<Member>('http://localhost:8080/sign-in'
      , {memberId:id, password:password});
      const status = response.status;
      if(status!=200) {
        throw Error;
      }
      const member = response.data as Member;
      return member;
    } catch (error) {
      throw new Error('Fail Login');
    }
};