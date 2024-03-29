import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { signIn } from '../apis/MemberApi';
// 상태 타입 정의
interface LoginFormState {
    id: string;
  password: string;
}

const LoginForm: React.FC = () => {
  // 상태를 관리하는 Hooks에 타입 적용
  const [state, setState] = useState<LoginFormState>({ id: '', password: '' });
  const navigate = useNavigate();

  // 입력 필드 변경 시 상태 업데이트 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    console.log('로그인 시도:', state.id, state.password);
    const member = await signIn(state.id, state.password);
    navigate('/chat');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          type="text"
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
      <button type="submit">Log In</button>
      <button><Link to="/sign-up">Sign Up</Link></button>
    </form>
  );
}

export default LoginForm;