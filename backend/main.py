import os
import string
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ctransformers import AutoModelForCausalLM

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join("models", "orca-mini-3b-gguf2-q4_0.gguf")
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH, 
    model_type="llama"
)

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """You are a helpful AI assistant that can answer questions about home inspections, scheduling, and property listings. Provide clear and concise responses."""

mock_listings = [
    {
        "id": 1,
        "title": "Cozy Cottage",
        "bedrooms": 2,
        "bathrooms": 1,
        "city": "San Jose",
        "price": 2000
    },
    {
        "id": 2,
        "title": "Modern Townhouse",
        "bedrooms": 3,
        "bathrooms": 2,
        "city": "San Jose",
        "price": 2800
    },
    {
        "id": 3,
        "title": "Downtown Condo",
        "bedrooms": 2,
        "bathrooms": 2,
        "city": "San Francisco",
        "price": 3200
    },
]

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    user_message = req.message.strip()
    
    # Clean the user message to remove punctuation like '?' or '='
    # so that 'properties?' still contains 'properties'
    cleaned_message = user_message.lower().translate(
        str.maketrans('', '', string.punctuation)
    )
    
    print(f"DEBUG - raw user message: {user_message}")        # Logs the exact user input
    print(f"DEBUG - cleaned user message: {cleaned_message}") # Logs the message after removing punctuation

    listing_keywords = [
        "property", "properties", 
        "show them all", "show me all", "list them all",
        "list all", "show all"
    ]

    # Check if any keyword is in the cleaned message
    if any(kw in cleaned_message for kw in listing_keywords):
        print("DEBUG - Matched listing keyword, returning mock listings.")
        listings_text = "\n".join([
            f"[ID {l['id']}] {l['title']} ({l['bedrooms']} bd / {l['bathrooms']} ba) - ${l['price']} - {l['city']}"
            for l in mock_listings
        ])
        reply = (
            "Here are some available properties:\n"
            f"{listings_text}\n"
            "Type an ID if you'd like more details."
        )
        return {"reply": reply}

    # Otherwise, the LLM handles it
    print("DEBUG - No listing keyword found, using LLM.")
    full_prompt = SYSTEM_PROMPT + "\nUser: " + user_message + "\nAI:"
    output = model(
        full_prompt,
        max_new_tokens=128,
        temperature=0.7,
        top_k=40,
        top_p=0.9,
        repetition_penalty=1.1
    )
    return {"reply": output}

class SlackPayload(BaseModel):
    message: str
    date: str = ""   # optional fields
    time: str = ""   # optional fields

@app.post("/fakeSlack")
def fake_slack_endpoint(payload: SlackPayload):
    """
    A fake Slack (or email) notification endpoint.
    In a real scenario, you'd post to Slack's webhook or an SMTP/email service.
    """
    print("FAKE SLACK MSG SENT:")
    print(f"Message: {payload.message}")
    print(f"Date: {payload.date}, Time: {payload.time}")
    return {"status": "ok", "info": "Slack message simulated"}