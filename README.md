# Belong AI Agent

This repository demonstrates a **React + TypeScript** application that simulates an AI agent assisting two types of users:

1. **Homeowners**:  
   - Gathers contact/home details.  
   - If the home is vacant and utilities are on, schedules an inspection.  
   - Triggers a (simulated) communication (email/Slack) after scheduling.

2. **Residents**:  
   - Collects their preferences (bedrooms, bathrooms, city, budget, etc.).  
   - Displays a short list of matching homes.  
   - Offers more details and a way to schedule a tour (simulated).

A local **Open Source LLM** can also be integrated (e.g., GPT4All or Orca Mini) in the backend (FastAPI + ctransformers) for free-form conversation if desired. However, the main flows here are **step-based** conversation UIs in React.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)  
2. [Project Structure](#project-structure)  
3. [Setup & Installation](#setup--installation)  
4. [Running the Application](#running-the-application)  
5. [Usage & Testing](#usage--testing)  
6. [Flows & Flowcharts](#flows--flowcharts)  
   - [Homeowner Conversation Flow](#homeowner-conversation-flow)  
   - [Resident Conversation Flow](#resident-conversation-flow)  
7. [Notes & Future Improvements](#notes--future-improvements)

---

## Architecture Overview

- **Frontend**: Built in **React + TypeScript** using a step-based chatbot pattern to guide users.  
- **Context**: A simple `AgentContext` that stores whether the user is a Homeowner or Resident.  
- **Homeowner Flow**: The **HomeownerAgent** component asks for name, contact info, vacancy, utilities; then schedules if vacant & utilities on.  
- **Resident Flow**: The **ResidentAgent** component gathers search criteria, shows mock listings, lets the user pick details or schedule.  
- **Optional LLM Integration**: If you have a **FastAPI** backend with GPT4All or ctransformers, you can embed advanced AI responses. Otherwise, the conversation logic is purely local (React state).

---