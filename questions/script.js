import questions from "./question.js";

const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let currentQuestion = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
const questionsIndexHistory = [];
let correctAnswersCount = 0;

// Display the quiz result and hide the quiz container
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
  document.querySelector(".result-message").innerHTML = resultText;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      highLightCorrectAnswer();

      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

      // Disable all answer options after one option is selected
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

// fetch a random question from based on the selected category

const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase(),
    )?.questions || [];

  if (
    questionsIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestions)
  ) {
    return showQuizResult();
  }
  // Filter out already asked questions and choose a random one
  const availableQuestions = categoryQuestions.filter(
    (_, index) => !questionsIndexHistory.includes(index),
  );
  const randomQuestion =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

const highLightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];

  correctOption.classList.add("correct");
  const iconHTML = `<i class="fa-regular fa-circle-check"></i>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");

  !isCorrect ? highLightCorrectAnswer() : correctAnswersCount++;

  const iconHTML = `${isCorrect ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-regular fa-circle-xmark"></i>'}`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  // Disable all answer options after one option is selected
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};
// Render the current question and its options in the quiz
const renderQuestions = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  resetTimer();
  startTimer();

  // update the UI
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313c";

  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

  // Create option <li> elements, append them and add click event listener
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

// Start the quiz and render the random question
const startQuiz = () => {
  configContainer.style.display = "none";
  quizContainer.style.display = "block";

  // Update the quiz category and number of questions

  quizCategory = configContainer.querySelector(
    ".category-option.active",
  ).textContent;
  numberOfQuestions = parseInt(
    configContainer.querySelector(".question-option.active").textContent,
  );

  renderQuestions();
};

document
  .querySelectorAll(".category-option, .question-option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });

// Reset the quiz and return the configuration page
const resetQuiz = () => {
  resetTimer();
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
};
// renderQuestions();

nextQuestionBtn.addEventListener("click", renderQuestions);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
