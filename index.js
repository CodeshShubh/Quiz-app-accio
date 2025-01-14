document.addEventListener("DOMContentLoaded", function () {
  let quizData = null;
  fetch("quiz-data.json")
    .then((res) => res.json())
    .then((data) => {
      quizData = data;
      //  console.log(quizData)
      initSection(); // for initilizing the section
    })
    .catch((err) => console.error("Error loading quiz data", err));

  function initSection() {
    const sections = document.querySelectorAll(".section");

    sections.forEach((section) => {
      section.addEventListener("click", () => {
        const sectionNumber = parseInt(section.getAttribute("data-section"));
        startQuiz(sectionNumber);
      });
    });
  }

  function startQuiz(index) {
    let currentQuestions = quizData.sections[index].questions;
    let currentQuestionsIndex = 0;
    let score = 0;
    let answerSelected = false;
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    document.getElementById('question-container').innerHTML =`
         <p id="score">Score:0</p>
         <div id="question"></div>
         <div id="options"></div>
         <div id="next-button">Next</div>`;

    showQuestions();

    function showQuestions() {
      const question = currentQuestions[currentQuestionsIndex];
      const questionElement = document.getElementById("question");
      const optionsElement = document.getElementById("options");

      questionElement.textContent = question.question;
      optionsElement.innerHTML = "";

      if (question.questionType === "mcq") {
        question.options.forEach((option) => {
          const optionElement = document.createElement("div");
          optionElement.textContent = option;
          optionElement.addEventListener("click", function () {
            if (!answerSelected) {
              answerSelected = true;
              optionsElement.classList.add("selected");
              checkAnswer(option, question.answer);
            }
          });
          optionsElement.appendChild(optionElement);
        });
      } else {
        const inputElement = document.createElement("input");
        inputElement.type =
          question.questionType === "number" ? "number" : "text";
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answer";
        submitButton.className = "submit-answer";

        submitButton.onclick = () => {
          if (!answerSelected) {
            answerSelected = true;
            checkAnswer(
              inputElement.value.toString(),
              question.answer.toString()
            );
          }
        };

        optionsElement.appendChild(inputElement);
        optionsElement.appendChild(submitButton);
      }
    }

    function checkAnswer(givenAnswer, correctAnswer) {
      const feedbackElement = document.createElement("div");
      feedbackElement.id = "feedback";
      if (
        givenAnswer === correctAnswer ||
        correctAnswer.toLowerCase() === givenAnswer.toLowerCase()
      ) {
        score++;
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
      } else {
        feedbackElement.textContent = `Wrong. Correct answer: ${correctAnswer}`;
        feedbackElement.style.color = "red";
      }
      const optionsElement = document.getElementById("options");
      optionsElement.appendChild(feedbackElement);
      updateScore();
    }

    function updateScore() {
      document.getElementById("score").textContent = `Score: ${score}`;
    }

    document.getElementById("next-button").addEventListener("click", () => {
      if (currentQuestionsIndex == currentQuestions.length - 1) {
        quizOver();
        console.log("quiz is over");    
      } else {
        answerSelected = false;
        currentQuestionsIndex++;
        showQuestions();
      }
    });

    function quizOver() {
        let questionContainer = document.getElementById('question-container');
        let quizContainer = document.getElementById('quiz-container')
      questionContainer.innerHTML = `<h1>Quiz Completed!<h1>
        <p>Your final score: ${score}/${currentQuestions.length}<p>
        <button id="home-button">Go to Home</button>
        `;
      document
        .getElementById("home-button")
        .addEventListener("click", function () {
          quizContainer.style.display = "grid";
          questionContainer.style.display = "none";
        });
    }
  }
});
