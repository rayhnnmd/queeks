const scoreElement = document.getElementById("score");
const correctElement = document.getElementById("correct-count");
const wrongElement = document.getElementById("wrong-count");
const messageElement = document.getElementById("result-message");
const conceptResultsElement = document.getElementById("concept-results");

const score = Number(sessionStorage.getItem("quizScore")) || 0;
const total = Number(sessionStorage.getItem("quizTotal")) || 0;

const correct = Number(sessionStorage.getItem("correctAnswers")) || score;
const wrong = Number(sessionStorage.getItem("incorrectAnswers")) || (total - score);
const percentage = total > 0
    ? Math.round((score / total) * 100)
    : 0;

scoreElement.textContent = `${score} / ${total}`;
correctElement.textContent = score;
wrongElement.textContent = wrong;

if (percentage >= 80) {
    messageElement.textContent = "Great work. You are good.";
} else if (percentage >= 50) {
    messageElement.textContent = "Good attempt. Keep practicing.";
} else {
    messageElement.textContent = "Keep practicing. You'll get there.";
}

const conceptResults = JSON.parse(
    sessionStorage.getItem("conceptResults") || "{}"
);

conceptResultsElement.innerHTML = "";

if (Object.keys(conceptResults).length === 0) {
    conceptResultsElement.textContent = "No concept data available.";
} else {
    for (const [concept, result] of Object.entries(conceptResults)) {
        const conceptTotal = result.correct + result.incorrect;
        const accuracy = conceptTotal > 0
            ? Math.round((result.correct / conceptTotal) * 100)
            : 0;
        const conceptCard = document.createElement("div");
        conceptCard.className = "concept-result";
        const title = document.createElement("h3");
        title.textContent = concept;
        const details = document.createElement("p");
        details.textContent = 
            `${result.correct} / ${conceptTotal} correct (${accuracy}%)`;

        conceptCard.appendChild(title);
        conceptCard.appendChild(details);
        conceptResultsElement.appendChild(conceptCard);
    }
}