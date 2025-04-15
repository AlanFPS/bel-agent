import React from 'react';
import { useAgentContext } from './context/AgentContext';
import { HomeownerAgent } from './components/HomeownerAgent';
import { ResidentAgent } from './components/ResidentAgent';
// import { ChatBox } from './components/ChatBox';

function App() {
  const { userType, setUserType } = useAgentContext();

  return (
    <div style={{ margin: '20px' }}>
      <h1>Belong AI Agent</h1>
      
      {!userType && (
        <div>
          <p>Select User Type:</p>
          <button onClick={() => setUserType('Homeowner')}>Homeowner</button>
          <button onClick={() => setUserType('Resident')}>Resident</button>
        </div>
      )}

      {userType === 'Homeowner' && <HomeownerAgent />}
      {userType === 'Resident' && <ResidentAgent />}

      {/* A simple chat box to talk to the LLM for clarifications */}
      {/* <ChatBox /> */}
    </div>
  );
}

export default App;