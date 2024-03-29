import React, { useState } from 'react';
import axios from 'axios';

interface SignUpFormState {
  username: string;
  id: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const [state, setState] = useState<SignUpFormState>({ username: '', id: '', password: '' });
  const [signUpError, setSignUpError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 회원가입 API 요청
      const response = await axios.post('https://your-api-url.com/signup', state);

      // 회원가입 성공 처리
      console.log('회원가입 성공:', response.data);
      // 회원가입 성공 후, 로그인 페이지로 리디렉션하거나 사용자에게 성공 메시지를 표시할 수 있습니다.
    } catch (error) {
      // 회원가입 실패 처리
      if (axios.isAxiosError(error) && error.response) {
        console.log('회원가입 실패:', error.response.data);
        setSignUpError('회원가입 실패: ' + error.response.data.message);
      } else {
        console.log('알 수 없는 에러가 발생했습니다.', error);
        setSignUpError('알 수 없는 에러가 발생했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          type="id"
          id="id"
          name="id"
          value={state.id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
      </div>
      {signUpError && <p>{signUpError}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpForm;