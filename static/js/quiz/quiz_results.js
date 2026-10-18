const scoreElement = document.getElementById("score");
const correctElement = document.getElementById("correct-count");
const wrongElement = document.getElementById("wrong-count");
const messageElement = document.getElementById("result-message");
const score = Number(sessionStorage.getItem("quizScore")) || 0;
const total = Number(sessionStorage.getItem("quizTotal"));
const wrong = total - score;
const percentage = Math.round((score / total) * 100);

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
