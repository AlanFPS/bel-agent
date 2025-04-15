import React, { useState } from 'react';
import { useAgentContext } from '../context/AgentContext';

export const ChatBox: React.FC = () => {
  const { conversation, addToConversation } = useAgentContext();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    addToConversation(`You: ${input}`);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        addToConversation(`AI: ${data.reply}`);
      }
    } catch (err) {
      console.error(err);
      addToConversation('AI: (Error communicating with server)');
    }
    setInput('');
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Chat with the AI Agent</h3>
      <div style={{ border: '1px solid #ccc', padding: 10, minHeight: 100 }}>
        {conversation.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
      <input
        style={{ width: '70%' }}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask the AI something..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};