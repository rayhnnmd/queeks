let currentQuestion = null;

const question = document.getElementById("question");
const options = document.getElementById("options");
const topic = document.getElementById("topic");
const difficulty = document.getElementById("difficulty");
const nextButton = document.getElementById("next-button");

async function loadQuestion() {
    question.textContent = "Loading...";
    options.innerHTML = "";
    nextButton.hidden = true;

    try {
        const response = await fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: "Arrays",
                difficulty: "Beginner"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to load question");
        }

        currentQuestion();

    } catch (error) {
        console.error(error);
        question.textContent = "Could not load the question.";
    }
}

function displayQuestion() {
    question.textContent = currentQuestion.question;
    topic.textContent = currentQuestion.topic;
    difficulty.textContent = currentQuestion.difficulty;

    currentQuestion.options.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "option";
        button.txtContent = answer;

        button.onclick = () => checkAnswer(index);

        options.appendChild(button);
    });
}


function checkAnswer(selectedIndex) {
    const buttons = document.querySelectorAll(".option");
    const correctIndex = currentQuestion.correct_answer;
    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === correctIndex) {
            button.classList.add("correct");
        }
    });

    if (selectedIndex !== correctIndex) {
        buttons[selectedIndex].classList.add("wrong");
    }

    nextButton.hidden = false;
}

nextButton.onclick = loadQuestion;

loadQuestion();