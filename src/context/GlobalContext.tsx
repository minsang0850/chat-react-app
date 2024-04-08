import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. 전역 상태 타입 정의
interface GlobalState {
  user: { memberNo: number; memberName: string;} | null;
  updateUser: (user: { memberNo: number; memberName: string } | null) => void;
}

// 2. Context 생성 및 초기값 설정
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// 3. Provider 컴포넌트 구현
export const GlobalProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<{ memberNo: number; memberName: string } | null>(null);
  

  const updateUser = (newUser: { memberNo: number; memberName: string } | null) => {
    if(newUser==null){
      return; 
    }
    setUser(newUser);
  };

  const value = { user, updateUser };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

// 4. 커스텀 Hook 구현
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};