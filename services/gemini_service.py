import os
import random

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
    concept: str

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")
client = genai.Client(api_key=api_key)

def generate_question(
    topic,
    difficulty="Beginner",
    previous_concepts=None,
    previous_correct_positions=None,
    previous_questions=None
):
    previous_concepts = previous_concepts or []
    previous_correct_positions = previous_correct_positions or []
    previous_questions = previous_questions or []

    previous_text = ", ".join(previous_concepts)
    question_history = "\n".join(
        f"- {question}" for question in previous_questions
    )
    prompt = f"""
Create one multiple choice computer science question for Queeks.

Topic: {topic}
Difficulty: {difficulty}

Requirements:
- Give exactly four options.
- Only one option must be correct.
- Make all incorrect options plausible.
- Keep options similar in length and detail.
- Make the question clear and unambiguous.
- Stay strictly within the requested topic.
- Avoid asking about the same concept repeatedly.

Previous concepts: 
{previous_text if previous_text else "None"}

Previous questions in this quiz:
{question_history if question_history else "None"}

Important:
- Do not repeat any previous question.
- Do not ask the same question using different wording.
- Do not reuse the same example, code snippet, or scenario.
- Choose a different subtopic or concept whenever possible.
- Ensure the correct answer is factually accurate.

Also provide:
- A short explanation of the correct answer.
- The concept being tested.

Return correct_answer as an index:
0 = first option
1 = second option
2 = third option
3 = fourth option
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": QuizQuestion,
        },
    )

    question = response.parsed

    if question is None:
        raise ValueError("Gemini did not return a valid question.")
    if not question.question.strip():
        raise ValueError("The generated question i empty.")
    if len(question.options) != 4:
        raise ValueError("The question must have exactly four options.")
    if not isinstance(question.correct_answer, int) or question.correct_answer not in range(4):
        raise ValueError("The correct answer index must be between 0 and 3.")
    if not question.question.strip() or not question.explanation.strip():
        raise ValueError("The question or explanation is empty.")
    if question.correct_answer not in range(4):
        raise ValueError("The correct answer index must be between 0 and 3")
    if len(set(question.options)) != 4:
        raise ValueError("The question contains duplicate options.")
    if not question.explanation.strip():
        raise ValueError("The question explanation is empty.")
    
    correct_option = question.options[question.correct_answer]
    wrong_options = [
        option
        for index, option in enumerate(question.options)
        if index != question.correct_answer
    ]
    random.shuffle(wrong_options)
    position_counts = [
        previous_correct_positions.count(index)
        for index in range(4)
    ]
    lowest_count = min(position_counts)
    available_positions = [
        index
        for index, count in enumerate(position_counts)
        if count == lowest_count
    ]
    new_correct_index = random.choice(available_positions)
    options = wrong_options
    options.insert(new_correct_index, correct_option)

    return question.model_copy(update={
        "options": options,
        "correct_answer": new_correct_index,
        "topic": topic,
        "difficulty": difficulty,
    })
