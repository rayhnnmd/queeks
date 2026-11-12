let currentQuestion = null;
let questionCount = 0;
let score = 0;
let answered = false;
let correctAnswers = 0;
let incorrectAnswers = 0;
let conceptResults = {};

let previousConcepts = [];
let previousCorrectPositions = [];
let previousQuestions = [];
let answerHistory = [];

const question = document.getElementById("question");
const options = document.getElementById("options");
const topic = document.getElementById("topic");
const difficulty = document.getElementById("difficulty");
const questionNumber = document.getElementById("question-number");
const explanation = document.getElementById("explanation");
const nextButton = document.getElementById("next-button");
const selectedTopic = new URLSearchParams(window.location.search).get("topic") || "Arrays";
topic.textContent = selectedTopic;

async function loadQuestion() {
    question.textContent = "Loading...";
    options.innerHTML = "";
    explanation.hidden = true;
    nextButton.hidden = true;
    answered = false;

    try {
        const response = await fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: selectedTopic,
                difficulty: "Beginner",
                previous_concepts: previousConcepts,
                previous_correct_positions: previousCorrectPositions,
                previous_questions: previousQuestions
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load question");
        }

        currentQuestion = data;
        previousCorrectPositions.push(data.correct_answer);
        previousQuestions.push(data.question);

        if (!previousConcepts.includes(data.concept)) {
            previousConcepts.push(data.concept);
        }

        questionCount++;
        questionNumber.textContent = `${questionCount} / 10`;

        displayQuestion();

    } catch (error) {
        console.error("Question error:", error);
        question.textContent = "Could not load the question.";
        explanation.textContent = error.message;
        explanation.hidden = false;
        nextButton.textContent = "Retry";
        nextButton.hidden = false;
    }
}

function displayQuestion() {
    question.textContent = currentQuestion.question;
    topic.textContent = currentQuestion.topic;
    difficulty.textContent = currentQuestion.difficulty;
    options.innerHTML = "";

    currentQuestion.options.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "option";
        button.textContent = answer;
        button.onclick = () => checkAnswer(index);
        options.appendChild(button);
    });
}


function checkAnswer(selectedIndex) {

    if (answered) {
        return;
    }

    answered = true;

    const buttons = document.querySelectorAll(".option");
    const correctIndex = currentQuestion.correct_answer;
    const concept = currentQuestion.concept || "General";

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === correctIndex) {
            button.classList.add("correct");
        }
    });

    if (!conceptResults[concept]) {
        conceptResults[concept] = {
            correct: 0,
            incorrect: 0
        };
    }

    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
        score++;
        correctAnswers++;
        conceptResults[concept].correct++;
    } else {
        incorrectAnswers++;
        conceptResults[concept].incorrect++;
        buttons[selectedIndex].classList.add("wrong");
    }

    answerHistory.push({
        question: currentQuestion.question,
        options: currentQuestion.options,
        selectedAnswer: selectedIndex,
        correctAnswer: correctIndex,
        explanation: currentQuestion.explanation,
        concept: concept,
        isCorrect: isCorrect
    });

    explanation.textContent = currentQuestion.explanation;
    explanation.hidden = false;
    nextButton.hidden = false;

    if (questionCount === 10) {
        nextButton.textContent = "Finish";
    } else {
        nextButton.textContent = "Next";
    }
    console.log("Score:", score);
}

nextButton.onclick = () => {
    if (questionCount >= 10 && answered) {
        sessionStorage.setItem("quizScore", score);
        sessionStorage.setItem("quizTotal", questionCount);
        sessionStorage.setItem("correctAnswer", correctAnswers);
        sessionStorage.setItem("incorrectAnswers", incorrectAnswers);
        sessionStorage.setItem("conceptResults", JSON.stringify(conceptResults));
        sessionStorage.setItem("answerHistory", JSON.stringify(answerHistory));

        window.location.href = "/results";
        return;
    }

    loadQuestion();
};
