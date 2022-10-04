const displayEl = document.getElementById('display');
const timerEl = document.getElementById('timer');
var timeLeft, gameScore, onQuestion;

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

// A function to render the question based on the globally stored index
const renderQuestion = () => {
    // Clear the display of any leftover content
    clearDisplay();

    // Retrieve the question data
    var message = questions[onQuestion].message;
    var options = questions[onQuestion].options;

    // Create and append the question to the display
    var messageEl = document.createElement('h1');
    messageEl.textContent = message;
    displayEl.append(messageEl);

    // Create a list and append the options
    var listEl = document.createElement('ul');
    listEl.setAttribute('id', 'options')
    for (let i=0; i<options.length; i++) {
        var newLi = document.createElement('li');
        newLi.textContent = options[i][0];
        newLi.classList.add('option', 'has-hover')
        newLi.dataset.state = options[i][1];
        newLi.addEventListener('click', handleAnswer)
        listEl.append(newLi);
    };

    // Append the list to the display
    displayEl.append(listEl)
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

// A function that handles the user's answer
const handleAnswer = (event) => {
    // Store the element in a variable
    var choice = event.target;
    
    // If the answer is correct, turn the option green and increment the score
    if (choice.dataset.state === 'correct') {
        choice.setAttribute('style', 'background-color:green');
        gameScore++;
    // If the answer is incorrect, turn the option red and decrement the timer
    } else {
        choice.setAttribute('style', 'background-color:red');
        timeLeft-=10;
    }

    // Disable the options to prevent the user from choosing two
    var options = document.querySelectorAll('.option');
    for (let i=0; i<options.length; i++) {
        options[i].removeEventListener('click', handleAnswer);
    };

    // Increment the question index
    onQuestion++;

    // Create the continue button
    var continueEl = document.createElement('li');
    continueEl.classList.add('continue', 'has-hover');

    // If all the questions have been answered, finish the quiz
    if (onQuestion === 3) {
        continueEl.textContent = 'Finish Quiz';
        continueEl.addEventListener('click', gameOver);
    
    // If there are questions left, render the next question
    } else {
        continueEl.textContent = 'Next Question';
        continueEl.addEventListener('click', renderQuestion);
    }

    // Append the continue button to the options
    var listEl = document.getElementById('options')
    listEl.append(continueEl);
};

// A function to handle the exit from the game
const gameOver = () => {
    timerEl.textContent = '';
    gameScore = gameScore * timeLeft;
    // renderScoreForm();
};

renderStart();