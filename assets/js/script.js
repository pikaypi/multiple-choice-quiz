const displayEl = document.getElementById('display');
const timerEl = document.getElementById('timer');

// A variable to hold the content of the quiz
const questions = [
    {
        message: 'A(n) _________ tag is used to define an interactive field where users can enter data.',
        options: [
            ['<datalist>', 'incorrect'],
            ['<input>', 'correct'],
            ['<enterpoint>', 'incorrect'],
            ['<dialog>', 'incorrect']
        ]
    },
    {
        message: 'The ________ CSS property is used to add space around sections of content.',
        options: [
            ['Spacing', 'incorrect'],
            ['Cleaner', 'incorrect'],
            ['Break', 'incorrect'],
            ['Padding', 'correct']
        ]
    },
    {
        message: 'Javascript files are linked to html with _________ tags',
        options: [
            ['<script>', 'correct'],
            ['<javascript>', 'incorrect'],
            ['<js>', 'incorrect'],
            ['<scripting>', 'incorrect']
        ]
    }
];

// A function that clears the display element
const clearDisplay = () => {
    while (displayEl.firstChild) {
        displayEl.removeChild(displayEl.firstChild);
    };
};

// A function to render the start button
const renderStart = () => {
    // If anything is in the display or the timer clear them
    clearDisplay();
    timerEl.textContent = '';

    // Create and append the start message
    var messageEl = document.createElement('h1');
    messageEl.textContent = 'Click below to start the quiz';
    displayEl.append(messageEl);

    // Create and append the start button
    var startBtnEl = document.createElement('div');
    startBtnEl.textContent = 'Start';
    startBtnEl.classList.add('option', 'has-hover');
    startBtnEl.addEventListener('click', startGame);
    displayEl.append(startBtnEl);

};

// A function to start the timer and the questions
const startGame = () => {
    // Set the timer and render it to the header
    timeLeft = 30;
    timerEl.textContent = timeLeft + ' s';

    // Reset the score and question index to 0
    gameScore = 0;
    onQuestion = 0;

    // Start the timer
    var timeInterval = setInterval(() => {
        // End the game when the timer runs out or when the last question is answered
        if (timeLeft === 1 || onQuestion === 3) {
            clearInterval(timeInterval);
            // gameOver();
        // If the game timer gets below 10, the display changes to red
        } else if (timeLeft <= 10) {
            timerEl.setAttribute('style', 'color:red;');
            timeLeft--;
            timerEl.textContent = timeLeft + ' s'
        // Increment the timer and update the page
        } else {
            timeLeft--;
            timerEl.textContent = timeLeft + ' s'
        }
    }, 1000);

    // Once the timer has started, render the first question to the display
    renderQuestion(questions[onQuestion].message, questions[onQuestion].options)
};

renderStart();