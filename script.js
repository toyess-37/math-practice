let currentSum = 0;
let startTime = 0;
let isGameActive = false;

const lengthSelect = document.getElementById('lengthSelect');
const display = document.getElementById('problemDisplay');
const input = document.getElementById('userAnswer');
const feedback = document.getElementById('feedback');
const resultText = document.getElementById('resultText');
const timeTakenDisplay = document.getElementById('timeTaken');
const giveUpContainer = document.getElementById('giveUpContainer');
const statusIndicator = document.getElementById('statusIndicator');

function generateProblem() {
    // 1. Reset UI
    const length = parseInt(lengthSelect.value);
    input.value = '';
    input.disabled = false;
    input.className = '';
    feedback.classList.add('hidden');
    giveUpContainer.classList.add('hidden');
    
    statusIndicator.innerHTML = ''; 

    input.focus();
    
    // Generate Numbers
    let problemString = "";
    let runningTotal = 0;

    for (let i = 0; i < length; i++) {
      // 40% chance for 2-digit, 60% chance for 3-digit
      const isThreeDigit = Math.random() > 0.3; 
      let num = isThreeDigit 
        ? Math.floor(Math.random() * 900) + 100 
        : Math.floor(Math.random() * 90) + 10;

      if (i === 0) {
        problemString += num;
        runningTotal += num;
      } else {
        const wantsToSubtract = Math.random() > 0.5;
        
        if (wantsToSubtract && (runningTotal - num >= 0)) {
            problemString += " - " + num;
            runningTotal -= num;
        } else {
            problemString += " + " + num;
            runningTotal += num;
        }
      }
    }

    // Update State
    display.innerText = problemString;
    currentSum = runningTotal;
    startTime = Date.now();
    isGameActive = true;
    
    // Show "Give Up" button after 5 seconds
    setTimeout(() => {
        if(isGameActive) giveUpContainer.classList.remove('hidden');
    }, 5000);
}

function checkInput() {
  if (!isGameActive) return;
  const val = parseInt(input.value);

  // Auto-detect correct answer
  if (val === currentSum) finishGame(true);
}

function finishGame(success) {
  isGameActive = false;
  const endTime = Date.now();
  const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
  
  giveUpContainer.classList.add('hidden');
  input.disabled = true; 
  
  if (success) {
    input.classList.add('success', 'pulse-anim');
    
    resultText.innerText = "CORRECT!";
    resultText.className = "result-title text-success";
    timeTakenDisplay.innerText = timeInSeconds;
  } else {
    // Failure Styling
    input.value = currentSum; // Reveal answer
    input.classList.add('error');

    resultText.innerText = "MISSED";
    resultText.className = "result-title text-error";
    timeTakenDisplay.innerText = "--";
  }

  feedback.classList.remove('hidden');
}

function giveUp() {
    if (!isGameActive) return;
    finishGame(false);
}

// "Enter" key to restart
window.addEventListener('keydown', function(e) {
  if (!isGameActive && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    generateProblem();
  }
});