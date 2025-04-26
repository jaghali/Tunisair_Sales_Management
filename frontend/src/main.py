from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai 
import os

app = FastAPI()

# Allow React frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for input
class Query(BaseModel):
    message: str

# Set your OpenAI API key (if using OpenAI)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/ask")
async def ask_ai(query: Query):
    try:
        # Replace this with your own logic or call to OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You're a helpful assistant."},
                {"role": "user", "content": query.message},
            ],
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}
