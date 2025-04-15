import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AgentContextProps {
  userType: 'Homeowner' | 'Resident' | null;
  setUserType: (type: 'Homeowner' | 'Resident' | null) => void;
  conversation: string[];
  addToConversation: (message: string) => void;
}

export const AgentContext = createContext<AgentContextProps>({
  userType: null,
  setUserType: () => {},
  conversation: [],
  addToConversation: () => {},
});

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<'Homeowner' | 'Resident' | null>(null);
  const [conversation, setConversation] = useState<string[]>([]);

  const addToConversation = (message: string) => {
    setConversation((prev) => [...prev, message]);
  };

  return (
    <AgentContext.Provider
      value={{
        userType,
        setUserType,
        conversation,
        addToConversation,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => useContext(AgentContext);