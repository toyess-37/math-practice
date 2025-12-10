let currentSum = 0;
let startTime = 0;
let isGameActive = false;

const modeSelect = document.getElementById('modeSelect');
const lengthSelect = document.getElementById('lengthSelect');
const lengthControl = document.getElementById('lengthControl');
const display = document.getElementById('problemDisplay');
const input = document.getElementById('userAnswer');
const feedback = document.getElementById('feedback');
const resultText = document.getElementById('resultText');
const timeTakenDisplay = document.getElementById('timeTaken');
const giveUpContainer = document.getElementById('giveUpContainer');

function rand(min, max) { return Math.floor(Math.random() * (max-min+1)) + min; }
function gcd(a,b) { return (b === 0) ? a : gcd(b, a%b); }
function lcm(a,b) { return (a*b)/gcd(a,b); }

function toggleLengthControl() {
	if (modeSelect.value === 'addsub') lengthControl.classList.remove('hidden');
	else lengthControl.classList.add('hidden');
}

const generators = {
	mult: () => {
		const type = Math.random() > 0.5 ? '2x2' : '2x1';
		let a = rand(10, 99);
		let b = (type === '2x2') ? rand(2, 9) : rand(10, 99);
		return {text: `${a} × ${b}`, answer: a*b};
	},

	lcm: () => {
		const a = rand(2, 9);
		const b = rand(10, 99);
		return {text: `LCM (${a}, ${b})`, answer: lcm(a,b)};
	},

	modulo: () => {
		const a = rand(10, 99);
		const b = rand(100, 999);
		return {text: `${b} % ${a}`, answer: b%a};
	},

	addsub: (fixedLength = null) => {
		const length = fixedLength || (Math.random() > 0.5 ? 5 : (Math.random() > 0.25 ? 4 : 6));
		let problemString = "";
		let runningTotal = 0;

		for (let i = 0; i < length; i++) {
			let num = Math.random() > 0.4 ? rand(100, 999) : rand(10, 99);

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

		return {text: problemString, answer: runningTotal};
	}
};

function generateProblem() {
	input.value = '';
	input.disabled = false;
	input.className = '';
	feedback.classList.add('hidden');
	giveUpContainer.classList.add('hidden');

	let mode = modeSelect.value;
	if (mode === 'mixed') {
		const modes = ['mult', 'lcm', 'modulo', 'addsub'];
		mode = modes[Math.floor(Math.random() * modes.length)];
	}

	let problem;
	if (mode === 'addsub') {
		const len = modeSelect.value === 'addsub' ? parseInt(lengthSelect.value) : null;
		problem = generators.addsub(len);
	} else problem = generators[mode]();

	input.focus();

	display.innerText = problem.text;
	currentAns = parseInt(problem.answer);

	startTime = Date.now();
	isGameActive = true;

	// Show 'Give Up' button after 5s
	setTimeout(() => {
		if (isGameActive) giveUpContainer.classList.remove('hidden');
	}, 5000);
}

function checkInput() {
	if (!isGameActive) return;
	const val = parseInt(input.value);

	// Auto-detect correct answer
	if (val === currentAns) finishGame(true);
}

function finishGame(success) {
	isGameActive = false;
	const endTime = Date.now();
	const timeInSeconds = ((endTime - startTime) / 1000);

	giveUpContainer.classList.add('hidden');
	input.disabled = true;

	if (success) {
		input.classList.add('success', 'pulse-anim');

		resultText.innerText = "CORRECT!";
		resultText.className = "result-title text-success";
		timeTakenDisplay.innerText = timeInSeconds;
	} else {
		input.value = currentAns;
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

window.addEventListener('keydown', function (e) {
	if (!isGameActive && (e.key === 'Enter' || e.key === ' ')) {
		e.preventDefault();
		generateProblem();
	}
});

toggleLengthControl();