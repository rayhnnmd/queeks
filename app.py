from flask import Flask, render_template, jsonify, request
from services.gemini_service import generate_question
import json

app = Flask(__name__)

def load_quiz(quiz_name):
    file_path = f"data/dsa/{quiz_name}.json"

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/topics")
def topics():
    return render_template("topics.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/api/question", methods=["POST"])
def get_question():
    data = request.get_json()

    topic = data.get("topic", "Arrays")
    difficulty = data.get("difficulty", "Beginner")

    question = generate_question(topic, difficulty)

    return jsonify(question.model_dump())
    

if __name__ == "__main__":
    app.run(debug=True)