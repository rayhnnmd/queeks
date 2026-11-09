from flask import Flask, render_template, jsonify, request
from services.gemini_service import generate_question


app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/topics")
def topics():
    return render_template("topics.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/results")
def results():
    return render_template("results.html")

@app.route("/api/question", methods=["POST"])
def get_question():
    data = request.get_json() or {}
    topic = data.get("topic", "Arrays")
    difficulty = data.get("difficulty", "Beginner")
    previous_concepts = data.get("previous_concepts", [])
    previous_correct_positions = data.get("previous_correct_positions", [])
    previous_questions = data.get("previous_questions", [])

    try:
        question = generate_question(
            topic=topic,
            difficulty=difficulty,
            previous_concepts=previous_concepts,
            previous_correct_positions=previous_correct_positions,
            previous_questions=previous_questions
        )
        return jsonify(question.model_dump())
    except Exception as error:
        print("Gemini error:", error)
        return jsonify({
            "error": "Could not generate the question. Please try again."
        }), 500    

if __name__ == "__main__":
    app.run(debug=True)