import os
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

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    user_message = req.message
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