const RANDOM_WORDS_URL = "http://api.quotable.io/random";
const quoteDisplay = document.querySelector("#display");
const quoteInputBox = document.querySelector(".input-box");
const timeLeft = document.querySelector("#timeLeft");
const resultBox = document.querySelector(".result-box");
const wpm = document.querySelector('#wpm');
const categoryDisplay = document.querySelector('#category');
const newHighScore = document.querySelector('#new-high-score');
const newHighScoreDisplay = document.querySelector('#score');
let category;
let isFirstInput = true;
let wordCount = 0;

newHighScoreDisplay.innerText = localStorage.getItem('high-score');
async function fetchQuote() {
  return fetch(RANDOM_WORDS_URL)
    .then((res) => res.json())
    .then((data) => data.content);
}

async function renderQuoteToDisplay() {
  const quote = await fetchQuote();
  quoteDisplay.innerHTML = "";
  quote.split("").forEach((character, index) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerHTML = character;
    quoteDisplay.appendChild(characterSpan);
  });
}

renderQuoteToDisplay();

quoteInputBox.addEventListener("input", () => {
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  const arrayInput = quoteInputBox.value.split("");
  let isAllCorrect = true;

  if (isFirstInput) {
    startTimer();
    isFirstInput = false;
  }

  arrayQuote.forEach((characterSpan, index) => {
    const inputChar = arrayInput[index];
    if (inputChar == null) {
      characterSpan.classList.remove("failure");
      characterSpan.classList.remove("success");
      isAllCorrect = false;
    } else if (inputChar == characterSpan.innerText) {
      characterSpan.classList.remove("failure");
      characterSpan.classList.add("success");
      isAllCorrect = true;
    } else {
      characterSpan.classList.remove("success");
      characterSpan.classList.add("failure");
      isAllCorrect = false;
    }
  });
  if (isAllCorrect) {
    wordCount += quoteInputBox.value.split(" ").length;
    renderQuoteToDisplay();
    quoteInputBox.value = "";
  }
});

function startTimer() {
  let timePassed = 1;
  let timer = setInterval(() => {
    timeLeft.innerText = 60 - timePassed;
    timePassed++;
    if(timePassed == 61){
        clearInterval(timer);
        wordCount += quoteInputBox.value.split(" ").length;
        if(wordCount>0 && wordCount<=30){
            category = "Below Average";
        }else if(wordCount > 30 && wordCount<=45){
            category = "Average";
        }else if(wordCount > 45 && wordCount <=75){
            category = "Fluent"
        }else if(wordCount > 75){
            category = "Professional"
        }
        wpm.innerText = wordCount;
        categoryDisplay.innerText = category;
        if(wordCount > localStorage.getItem("high-score") || localStorage.getItem("high-score") == null){
            newHighScore.style.display = "block";
            newHighScoreDisplay.innerText = wordCount;
            localStorage.setItem("high-score", wordCount);
        }
        resultBox.style.display = "block";
        wordCount = 0;
    }
  }, 1000);
  
}
