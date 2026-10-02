import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()

class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: int
    explanation: str
    topic: str
    difficulty: str

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=api_key)

def generate_question(topic, difficulty="Beginner"):
    prompt = f"""
Generate one multiple choice computer science questions for Queeks.

Topic: {topic}
Difficulty: {difficulty}

The question should:
- have exactly 4 options
- have only one correct answer
- test understanding rather than memorization
- be technically accurate
- include a short explanation
- avoid trick questions

Return the correct answer as the index of the option.
The first option has index 0.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    return response.parsed