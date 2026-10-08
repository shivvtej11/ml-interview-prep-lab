const chart = document.querySelector("#chart");
const hoursSlider = document.querySelector("#study-hours");
const kSlider = document.querySelector("#k-value");
const hoursValue = document.querySelector("#hours-value");
const prediction = document.querySelector("#prediction");
const neighborText = document.querySelector("#neighbors");
const confidence = document.querySelector("#confidence");
const resultIcon = document.querySelector("#result-icon");
const kDisplay = document.querySelector("#k-display");
let requestNumber = 0;

async function renderModel() {
  const hours = Number(hoursSlider.value);
  const k = Number(kSlider.value);
  hoursValue.value = hours.toFixed(1);
  hoursValue.textContent = hours.toFixed(1);
  kDisplay.textContent = k;
  const thisRequest = ++requestNumber;

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours, k })
    });
    const data = await response.json();
    if (thisRequest !== requestNumber) return;
    if (!response.ok) throw new Error(data.error || "The prediction request failed.");

    chart.querySelectorAll(".chart-point").forEach((point) => point.remove());
    data.training_data.forEach((point) => {
      const dot = document.createElement("span");
      dot.className = `chart-point ${point.result}${data.neighbors.includes(point.hours) ? " neighbor" : ""}`;
      dot.style.left = `${(point.hours / 8) * 100}%`;
      dot.style.bottom = `${point.result === "pass" ? 68 : point.hours < 2 ? 17 : 37}%`;
      dot.title = `${point.hours} study hours: ${point.result}`;
      chart.append(dot);
    });
    const marker = document.createElement("span");
    marker.className = "chart-point new-student";
    marker.style.left = `${(hours / 8) * 100}%`;
    marker.style.bottom = "47%";
    marker.title = `New student: ${hours} study hours`;
    chart.append(marker);

    prediction.textContent = data.label === "pass" ? "Likely to pass" : "May need to retry";
    neighborText.textContent = `${data.passed_neighbors} passed · ${data.retry_neighbors} retried among nearest ${k}`;
    confidence.textContent = `${data.confidence}% vote`;
    resultIcon.textContent = data.label === "pass" ? "✓" : "↻";
    resultIcon.classList.toggle("retry", data.label === "retry");
  } catch (error) {
    if (thisRequest !== requestNumber) return;
    prediction.textContent = "Prediction unavailable";
    neighborText.textContent = error.message;
    confidence.textContent = "";
  }
}

hoursSlider.addEventListener("input", renderModel);
kSlider.addEventListener("input", renderModel);
document.querySelector("#reset-model").addEventListener("click", () => {
  hoursSlider.value = 4;
  kSlider.value = 3;
  renderModel();
});
renderModel();

const questions = [
  { question: "What does the “k” in k-nearest neighbors represent?", answers: ["The number of closest examples the model checks", "The number of features in the data", "The model’s accuracy score"], correct: 0, explain: "Exactly. k is how many nearby examples get to vote." },
  { question: "Why do we call this supervised learning?", answers: ["A person watches the model work", "The examples already have known labels", "The model only works with small datasets"], correct: 1, explain: "Right. The training examples include labels—in our case, pass or retry." },
  { question: "What happens if you set k to 1?", answers: ["The model asks one closest example", "The model uses every example", "The model cannot make a prediction"], correct: 0, explain: "Yes. With k = 1, the single nearest example decides the prediction." },
  { question: "What is a training example in this lab?", answers: ["The slider setting", "One past student with study hours and a result", "The prediction card"], correct: 1, explain: "Correct. Each example contains input (hours) and its known outcome (result)." },
  { question: "What is one limitation of this tiny demo?", answers: ["It needs labeled examples", "It can only use numbers", "Study time alone may not explain exam results"], correct: 2, explain: "Exactly. Real results depend on many factors. A model can only use the information it is given." }
];

let questionIndex = 0;
let score = 0;
let answered = false;
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");

function renderQuestion() {
  const item = questions[questionIndex];
  answered = false;
  document.querySelector("#question-count").textContent = `QUESTION ${String(questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  document.querySelector("#progress-fill").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  questionText.textContent = item.question;
  feedback.textContent = "";
  nextButton.disabled = true;
  nextButton.innerHTML = "Choose an answer <span>→</span>";
  answerList.replaceChildren();
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answerList.append(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  [...answerList.children].forEach((option, optionIndex) => {
    option.disabled = true;
    if (optionIndex === item.correct) option.classList.add("correct");
    else if (optionIndex === index) option.classList.add("incorrect");
  });
  if (index === item.correct) score += 1;
  feedback.textContent = item.explain;
  document.querySelector("#score-display").innerHTML = `SCORE <b>${score}</b>`;
  nextButton.disabled = false;
  nextButton.innerHTML = questionIndex === questions.length - 1 ? "See your result <span>→</span>" : "Next question <span>→</span>";
}

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  const message = score === questions.length ? "Perfect score—great explanation skills." : score >= 3 ? "Nice work. Review any concepts that felt uncertain." : "Good start. Try the model again, then retake the quiz.";
  questionText.textContent = `You scored ${score} out of ${questions.length}.`;
  answerList.replaceChildren();
  feedback.textContent = message;
  document.querySelector("#question-count").textContent = "LAB COMPLETE";
  nextButton.innerHTML = "Retake the quiz <span>↻</span>";
  nextButton.onclick = () => {
    questionIndex = 0;
    score = 0;
    document.querySelector("#score-display").innerHTML = "SCORE <b>0</b>";
    nextButton.onclick = null;
    renderQuestion();
  };
});
renderQuestion();
