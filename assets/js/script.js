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
    renderScoreForm();
};

const renderScoreForm = () => {
    clearDisplay();

    var messageEl = document.createElement('h1');
    messageEl.textContent = 'Enter your initials';
    displayEl.append(messageEl);

    var scoreEl = document.createElement('h2');
    scoreEl.textContent = gameScore;
    displayEl.append(scoreEl);

    var scoreForm = document.createElement('form');

    var initialsInput = document.createElement('input');
    initialsInput.setAttribute('type', 'text');
    initialsInput.setAttribute('name', 'initials');
    initialsInput.setAttribute('id', 'initials');
    scoreForm.append(initialsInput);

    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');
    scoreForm.append(submitBtn);
    
    scoreForm.addEventListener('submit', handleScoreSubmit);
    displayEl.append(scoreForm)
};

const handleScoreSubmit = (event) => {
    event.preventDefault();
    const initialsEl = document.getElementById('initials');
    var scores;
    if (!localStorage.scores) {
        scores = {
            scoresList: [gameScore],
            initials: {}
        };
        scores.initials[gameScore] = initialsEl.value;
    } else {
        var scores = JSON.parse(localStorage.scores);
        var scoresList = scores.scoresList.sort(function(a, b) {return a-b});
        if (scoresList.length < 5) {
            scoresList.push(gameScore);
            scores.initials[gameScore] = initialsEl.value;
        } else {
            if (gameScore > scoresList[0]) {
                delete scores.initials[scoresList[0]]
                scores.scoresList[0] = gameScore;
                scores.initials[gameScore] = initialsEl.value;
            }
        }
    };
    localStorage.setItem('scores', JSON.stringify(scores));
    renderStart();
    renderHighScores();
};

const hideHighScores = () => {
    document.getElementById('high-score-display').remove()
};

const renderHighScores = () => {
    const scoreDisplayEl = document.createElement('div');
    scoreDisplayEl.setAttribute('id', 'high-score-display');
    scoreDisplayEl.classList.add('high-score');

    const scoreDisplayMessageEl = document.createElement('h1');
    scoreDisplayMessageEl.textContent = 'High Scores';
    scoreDisplayEl.append(scoreDisplayMessageEl);

    const exitBtn = document.createElement('div');
    exitBtn.textContent = 'X';
    exitBtn.classList.add('exit-btn', 'has-hover')
    exitBtn.addEventListener('click', hideHighScores)
    scoreDisplayEl.append(exitBtn);

    const highScoresList = document.createElement('ul');
    highScoresList.classList.add('scores-list');

    const scores = JSON.parse(localStorage.scores);
    scores.scoresList = scores.scoresList.sort(function(a, b) {return a-b});
    for (let i=scores.scoresList.length-1; i>=0; i--) {
        const newScore = document.createElement('li');
        newScore.classList.add('score');
        newScore.textContent = `${scores.scoresList[i]}: ${scores.initials[scores.scoresList[i]]}`;
        highScoresList.append(newScore);
    };
    scoreDisplayEl.append(highScoresList);
    document.body.append(scoreDisplayEl);
};

const highScoresBtn = document.getElementById('high-scores-btn');
highScoresBtn.addEventListener('click', renderHighScores);
renderStart();