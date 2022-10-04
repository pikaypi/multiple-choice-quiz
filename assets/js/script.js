const displayEl = document.getElementById('display');
const timerEl = document.getElementById('timer');

// A function that clears the display element
const clearDisplay = () => {
    while (displayEl.firstChild) {
        displayEl.removeChild(displayEl.firstChild);
    };
};

// A function to render the start button
const renderStart = () => {
    console.log(displayEl);
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

// A placeholder to start the game
const startGame = () => {
    console.log('Game started');
};

renderStart();