from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro-001")
chat = model.start_chat(history=[])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- YOUR frontend Vite URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request input
class UserMessage(BaseModel):
    message: str

# Function to simulate basic platform navigation responses
def handle_navigation_command(command: str):
    command = command.lower()
    if "go to home" in command:
        return "🏠 Navigating to the **Home Page**..."
    elif "open settings" in command:
        return "⚙️ Opening **Settings**..."
    elif "log out" in command:
        return "🔒 Logging you out..."
    elif "profile" in command:
        return "👤 Opening your **Profile** page..."
    else:
        return None

# Gemini response function
def get_gemini_response(prompt: str):
    response = chat.send_message(prompt)
    return response.text

# API endpoint
@app.post("/chat")
async def chat_endpoint(user_input: UserMessage):
    message = user_input.message
    nav_response = handle_navigation_command(message)

    if nav_response:
        return {
            "type": "navigation",
            "response": nav_response
        }

    # Otherwise use Gemini for general Q&A
    gemini_response = get_gemini_response(message)
    return {
        "type": "chat",
        "response": gemini_response
    }