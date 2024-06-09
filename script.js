document.addEventListener('DOMContentLoaded', () => {
    const levelSelectionContainer = document.getElementById('level-selection-container');
    const gameContainer = document.getElementById('game-container');
    const winContainer = document.getElementById('win-container');
    const board = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const leaderboard = document.getElementById('leaderboard');
    const timerElement = document.getElementById('timer');
    const level1Button = document.getElementById('level-1-button');
    const level2Button = document.getElementById('level-2-button');
    const playAgainButton = document.getElementById('play-again-button');
    const easterEgg = document.getElementById('easter-egg');

    const level1Cards = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'
    ];
    const level2Cards = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
        'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
    ];

    let shuffledCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let timer;
    let startTime;
    let currentLevel = 1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        const cards = currentLevel === 1 ? level1Cards : level2Cards;
        shuffledCards = shuffle([...cards]);
        board.innerHTML = '';
        const gridTemplateColumns = currentLevel === 1 ? 'repeat(4, 100px)' : 'repeat(4, 100px)';
        board.style.gridTemplateColumns = gridTemplateColumns;
        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = card;
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', flipCard);
            if (currentLevel === 2) {
                cardElement.classList.add('rotate');
            }
            board.appendChild(cardElement);
        });
        matchedPairs = 0;
        startTimer();
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.card;
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.card === card2.dataset.card) {
            matchedPairs++;
            anime({
                targets: [card1, card2],
                scale: [1, 1.5, 1],
                duration: 500,
                easing: 'easeInOutQuad'
            });
            if (matchedPairs === shuffledCards.length / 2) {
                setTimeout(endGame, 500);
            }
        } else {
            card1.classList.remove('flipped');
            card1.textContent = '';
            card2.classList.remove('flipped');
            card2.textContent = '';
        }
        flippedCards = [];
    }

    function startTimer() {
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Time: ${elapsedTime}s`;
    }

    function endGame() {
        clearInterval(timer);
        alert('You won!');
        showWinScreen();
        const playerName = prompt('Enter your name:');
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        updateLeaderboard(playerName, elapsedTime);
        createBoard();
    }

    function updateLeaderboard(playerName, elapsedTime) {
        const li = document.createElement('li');
        li.textContent = `${playerName} - ${elapsedTime}s`;
        leaderboard.appendChild(li);
    }

    function showWinScreen() {
        gameContainer.classList.add('hidden');
        winContainer.classList.remove('hidden');
        animateEasterEgg();
    }

    function animateEasterEgg() {
        easterEgg.textContent = '🥚';
        anime({
            targets: '#easter-egg',
            scale: [0, 1],
            rotate: '1turn',
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }

    function resetGame() {
        winContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        timerElement.textContent = 'Time: 0s';
        createBoard();
    }

    function selectLevel(level) {
        currentLevel = level;
        levelSelectionContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    }

    level1Button.addEventListener('click', () => selectLevel(1));
    level2Button.addEventListener('click', () => selectLevel(2));
    startButton.addEventListener('click', createBoard);
    playAgainButton.addEventListener('click', resetGame);
});

