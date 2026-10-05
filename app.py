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

@app.route("/api/question", methods=["POST"])
def get_question():
    data = request.get_json() or {}

    topic = data.get("topic", "Arrays")
    difficulty = data.get("difficulty", "Beginner")
    previous_concepts = data.get("previous_concepts", [])

    try:
        question = generate_question(topic, difficulty, previous_concepts)
        return jsonify(question.model_dump())

    except Exception as error:
        print("Gemini error:", error)

        return jsonify({
            "error": str(error)
        }), 500    

if __name__ == "__main__":
    app.run(debug=True)