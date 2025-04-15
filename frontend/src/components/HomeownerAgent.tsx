import React, { useState, useEffect } from 'react';
import { homeownerSteps } from '../conversation/homeownerQuestions';
import { useAgentContext } from '../context/AgentContext';

interface HomeownerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  isVacant: boolean;
  utilitiesOn: boolean;
  inspectionDate?: string;
  inspectionTime?: string;
}

export const HomeownerAgent: React.FC = () => {
  const { setUserType } = useAgentContext();

  const [conversation, setConversation] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Stores user data from conversation
  const [homeownerData, setHomeownerData] = useState<HomeownerData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    isVacant: false,
    utilitiesOn: false,
  });

  // Holds the current user input from the chat text box
  const [userInput, setUserInput] = useState('');

  // Once we've asked all questions, we check conditions
  const [askingForScheduling, setAskingForScheduling] = useState(false);
  const [inspectionScheduled, setInspectionScheduled] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Show first question when the component mounts
    setConversation([`AI: ${homeownerSteps[0].prompt}`]);
  }, []);

  const handleSend = () => {
    if (!userInput.trim()) return;

    // Add user message to conversation
    addToConversation(`You: ${userInput}`);

    // If we are in the standard steps flow
    if (!askingForScheduling && !inspectionScheduled && currentStepIndex < homeownerSteps.length) {
      processAnswer(userInput);
    }
    // If we've already qualified and are scheduling an inspection
    else if (askingForScheduling) {
      processScheduling(userInput);
    }

    setUserInput(''); // clear input
  };

  /** Add a new line to conversation array */
  const addToConversation = (msg: string) => {
    setConversation((prev) => [...prev, msg]);
  };

  /** Process user input for the qualification steps */
  const processAnswer = (answer: string) => {
    const currentStep = homeownerSteps[currentStepIndex];
    const field = currentStep.field;

    // Create a copy of the current homeownerData so we have updated fields immediately
    let updatedData = { ...homeownerData };

    // Parse yes/no if needed
    if (field === 'isVacant' || field === 'utilitiesOn') {
      const yes = /^(yes|y)$/i.test(answer.trim());
      updatedData[field] = yes;
    } else {
      // For name, email, phone, address
      updatedData[field] = answer.trim();
    }

    // Update state
    setHomeownerData(updatedData);

    const nextStepIndex = currentStepIndex + 1;

    // If there's another step
    if (nextStepIndex < homeownerSteps.length) {
      setCurrentStepIndex(nextStepIndex);
      const nextPrompt = homeownerSteps[nextStepIndex].prompt;
      addToConversation(`AI: ${nextPrompt}`);
    } else {
      // We have all the homeowner data now, pass the updated data
      handleAllInfoCollected(updatedData);
    }
  };

  /** Called when last step is answered, check if we can schedule or not */
  const handleAllInfoCollected = (data: HomeownerData) => {
    const { isVacant, utilitiesOn } = data;
    if (isVacant && utilitiesOn) {
      addToConversation("AI: Great! Since your home is vacant and the utilities are on, we can schedule an inspection.");
      addToConversation("AI: Please let me know a convenient date/time for the inspection, or just say a date/time you'd like.");
      setAskingForScheduling(true);
    } else {
      addToConversation("AI: Thanks for the information! We'll follow up soon with more details or next steps.");
      setDone(true);
    }
  };

  /** Process the user’s scheduling info (date/time) */
  const processScheduling = (answer: string) => {
    // For simplicity, assume user typed something like "Dec 1st at 10 AM"
    // or "2025-12-01 10:00" – we'll just store that
    setHomeownerData((prev) => ({
      ...prev,
      inspectionDate: answer.trim(),
    }));

    // Confirm scheduling
    setInspectionScheduled(true);
    addToConversation(`AI: Great, we'll schedule your inspection on "${answer.trim()}"!`);
    triggerCommunication(); 
  };

  /** Communication Trigger */
  const triggerCommunication = () => {
    // Simulation
    addToConversation("AI: We have sent this information to your email and Slack. Thank you!");
    setAskingForScheduling(false);
    setDone(true);
  };

  return (
    <div>
      <h2>Homeowner Agent</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, minHeight: 200 }}>
        {conversation.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
      {!done && (
        <>
          <input
            style={{ width: '70%' }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button onClick={handleSend}>Send</button>
        </>
      )}
      {done && (
        <div style={{ marginTop: 10 }}>
          <strong>Conversation finished.</strong>
          <p>Collected Data: {JSON.stringify(homeownerData, null, 2)}</p>
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setUserType(null)}>Go Back</button>
      </div>
    </div>
  );
};