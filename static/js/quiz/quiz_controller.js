let currentQuestion = null;
let questionCount = 0;
let score = 0;
let answered = false;
let previousConcepts = [];

const question = document.getElementById("question");
const options = document.getElementById("options");
const topic = document.getElementById("topic");
const difficulty = document.getElementById("difficulty");
const questionNumber = document.getElementById("question-number");
const explanation = document.getElementById("explanation");
const nextButton = document.getElementById("next-button");

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
                topic: "Arrays",
                difficulty: "Beginner",
                previous_concepts: previousConcepts
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load question");
        }

        currentQuestion = data;

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
    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === correctIndex) {
            button.classList.add("correct");
        }
    });

    if (selectedIndex === correctIndex) {
        score++;
    } else {
        buttons[selectedIndex].classList.add("wrong");
    }
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
    if (questionCount >= 10) {
        nextButton.hidden = true;
        return;
    }

    loadQuestion();
};

loadQuestion();