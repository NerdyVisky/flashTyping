const RANDOM_WORDS_URL = "http://api.quotable.io/random";
const quoteDisplay = document.querySelector("#display");
const quoteInputBox = document.querySelector(".input-box");
const timeLeft = document.querySelector("#timeLeft");
let isFirstInput = true;

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
    renderQuoteToDisplay();
    quoteInputBox.value = "";
  }
});

function startTimer() {
  let timePassed = 1;
  setInterval(() => {
    timeLeft.innerText = 60 - timePassed;
    timePassed++;
    if(timePassed == 10){
        clearInterval();
        alert("time over");
        location.reload();
    }
  }, 1000);
  
}
