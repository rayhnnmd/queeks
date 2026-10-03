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
Create one computer science multiple choice question for Queeks.

Topic: {topic}
Difficulty: {difficulty}

Give exactly four options and only one correct answer.

The question should test understanding and should not be ambiguous or intentionally tricky.

Also provide a short explanation of the correct answer.

Return the correct answer as an index:
0 = first option
1 = second option
2 = third option
3 = fourth option
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": QuizQuestion,
        },
    )

    return response.parsed