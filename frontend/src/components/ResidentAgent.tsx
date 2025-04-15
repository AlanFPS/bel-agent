import React, { useState, useEffect } from 'react';
import { residentSteps } from '../conversation/residentQuestions';
import { useAgentContext } from '../context/AgentContext';

interface ResidentData {
  bedrooms: number;
  bathrooms: number;
  city: string;
  budget?: number;
  additionalPreferences?: string;
}

interface Listing {
  id: number;
  title: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  price: number;
  details: string; // For more info
}

// Mock listings: In a real scenario, you might fetch from an API
const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Cozy Cottage',
    bedrooms: 2,
    bathrooms: 1,
    city: 'San Jose',
    price: 2000,
    details: 'A small cottage with a nice backyard, pet-friendly.'
  },
  {
    id: 2,
    title: 'Modern Townhouse',
    bedrooms: 3,
    bathrooms: 2,
    city: 'San Jose',
    price: 2800,
    details: 'Townhouse in a gated community, close to shops.'
  },
  {
    id: 3,
    title: 'Downtown Condo',
    bedrooms: 2,
    bathrooms: 2,
    city: 'San Francisco',
    price: 3200,
    details: 'Condo with skyline views, walking distance to public transit.'
  },
];

export const ResidentAgent: React.FC = () => {
  const { setUserType } = useAgentContext(); // Access context to allow resetting userType

  const [conversation, setConversation] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Stores the user’s data
  const [residentData, setResidentData] = useState<ResidentData>({
    bedrooms: 0,
    bathrooms: 0,
    city: '',
    budget: undefined,
    additionalPreferences: '',
  });

  // Holds the user’s current input from the chat text box
  const [userInput, setUserInput] = useState('');

  // Whether we've collected all data and are now showing listings
  const [doneCollecting, setDoneCollecting] = useState(false);

  // Whether we’ve shown listings and are waiting for user commands (like “more info” or “schedule”)
  const [showingListings, setShowingListings] = useState(false);

  useEffect(() => {
    // Show the first question
    setConversation([`AI: ${residentSteps[0].prompt}`]);
  }, []);

  // Called when user hits “Send”
  const handleSend = () => {
    if (!userInput.trim()) return;
    addToConversation(`You: ${userInput}`);

    if (!doneCollecting && currentStepIndex < residentSteps.length) {
      processAnswer(userInput);
    } else if (showingListings) {
      // user is interacting with the listings (like "1", "details", "schedule", etc.)
      processListingInteraction(userInput);
    }

    setUserInput('');
  };

  // Helper to add lines to the conversation array
  const addToConversation = (msg: string) => {
    setConversation((prev) => [...prev, msg]);
  };

  // Process the user’s answer to one of the initial steps
  const processAnswer = (answer: string) => {
    const step = residentSteps[currentStepIndex];
    const updatedData = { ...residentData };

    // Convert text to number for bedrooms/bathrooms/budget, if needed
    if (step.field === 'bedrooms' || step.field === 'bathrooms') {
      updatedData[step.field] = parseInt(answer.trim(), 10) || 0;
    } else if (step.field === 'budget') {
      if (answer.toLowerCase() === 'skip') {
        updatedData.budget = undefined;
      } else {
        const val = parseInt(answer.trim(), 10);
        updatedData.budget = isNaN(val) ? undefined : val;
      }
    } else if (step.field === 'additionalPreferences') {
      if (answer.toLowerCase() === 'skip') {
        updatedData.additionalPreferences = '';
      } else {
        updatedData.additionalPreferences = answer.trim();
      }
    } else {
      // city or any other string field
      updatedData[step.field] = answer.trim();
    }

    setResidentData(updatedData);

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < residentSteps.length) {
      setCurrentStepIndex(nextStepIndex);
      addToConversation(`AI: ${residentSteps[nextStepIndex].prompt}`);
    } else {
      // we have all the data
      handleAllDataCollected(updatedData);
    }
  };

  // Once all data is collected, we show listings
  const handleAllDataCollected = (data: ResidentData) => {
    addToConversation("AI: Great, let me see what matches your preferences...");
    
    // Potentially do any filtering or logic here
    // For now, let's just show all mock listings or do basic filter
    setDoneCollecting(true);

    // Wait a moment and show the results
    setTimeout(() => {
      showMatchingListings(data);
    }, 1000);
  };

  const showMatchingListings = (data: ResidentData) => {
    // Filter mock listings based on user data
    const filtered = mockListings.filter((listing) => {
      // bedrooms/bathrooms must be >= user preference
      if (listing.bedrooms < data.bedrooms) return false;
      if (listing.bathrooms < data.bathrooms) return false;

      // city: if user typed something for city, must match (case-insensitive)
      if (data.city && listing.city.toLowerCase() !== data.city.toLowerCase()) {
        return false;
      }
      // budget
      if (data.budget && listing.price > data.budget) {
        return false;
      }
      // additionalPreferences => skipping advanced logic for example
      // could parse keywords, but let's keep it simple
      return true;
    });

    if (filtered.length === 0) {
      addToConversation("AI: Sorry, no listings found matching that criteria. You can refine your preferences or type 'restart' to try again.");
      setShowingListings(true);
      return;
    }

    addToConversation("AI: Here are some matching homes:");
    filtered.forEach((home) => {
      addToConversation(` - [ID ${home.id}] ${home.title} | ${home.bedrooms} bed / ${home.bathrooms} bath | $${home.price} in ${home.city}`);
    });
    addToConversation("AI: Type the **ID** of the home to see more details, or type 'schedule' to schedule a tour, or 'done' to finish.");
    
    setShowingListings(true);
  };

  // Process user commands while showing listings
  const processListingInteraction = (cmd: string) => {
    const lowerCmd = cmd.trim().toLowerCase();

    if (lowerCmd === 'done') {
      addToConversation("AI: Alright! Let me know if you need anything else. Have a great day!");
      setShowingListings(false);
      return;
    }

    if (lowerCmd === 'schedule') {
      addToConversation("AI: Sure! Let's schedule a tour. When would you like to visit?");
      // could expand to a scheduling subflow like we did with the homeowner
      // for now, let's just simulate
      setTimeout(() => {
        addToConversation("AI: Tour scheduled! We'll send details via email shortly. Thank you!");
      }, 1000);
      setShowingListings(false);
      return;
    }

    // if the user typed a number, assume it's the listing ID
    const idNum = parseInt(lowerCmd, 10);
    if (!isNaN(idNum)) {
      // find listing
      const listing = mockListings.find((l) => l.id === idNum);
      if (listing) {
        addToConversation(`AI: More details about [ID ${listing.id}] ${listing.title}: ${listing.details}`);
        addToConversation("AI: Type 'schedule' to schedule a tour, 'done' to exit, or another ID to see a different home.");
      } else {
        addToConversation("AI: Sorry, that ID didn't match any listing. Try again or type 'done' to finish.");
      }
    } else {
      addToConversation("AI: Sorry, I didn't understand. Type an ID (1,2,3), 'schedule' to schedule a tour, or 'done' to exit.");
    }
  };

  return (
    <div>
      <h2>Resident Agent</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, minHeight: 200 }}>
        {conversation.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {/* If we've not ended or the user hasn't typed 'done', show input box */}
      {(doneCollecting || currentStepIndex < residentSteps.length || showingListings) && (
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

      {/* For debugging or to show final data */}
      {(!showingListings && doneCollecting) && (
        <div style={{ marginTop: 10 }}>
          <strong>Collected Data:</strong>
          <pre>{JSON.stringify(residentData, null, 2)}</pre>
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setUserType(null)}>Go Back</button>
      </div>
    </div>

    
  );
};