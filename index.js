function startGame(id) {
    fetch('./levels.json')
        .then(res => res.json())
        .then(data => renderBoard(data[id]));

}
startGame(0);

function renderBoard(data) {
    const board = document.querySelector('.memory_board');
    board.innerHTML = '';
    data.icons.forEach(icon => {
        const memoryCard = document.createElement("div");
        const name = icon.split('/').pop().split('.').shift();
        memoryCard.classList.add('memory_card');
        memoryCard.dataset.image = name;
        memoryCard.innerHTML = `<img class="front_face" src="${icon}" alt="${name}">
        <img class="back_face" src="${data.badge}" alt="Memory Card">`
        board.append(memoryCard.cloneNode(true), memoryCard.cloneNode(true));
    })

    memoryGame();
}

function memoryGame() {
    const cards = document.querySelectorAll('.memory_card');
    const movesCount = document.querySelector('.moves_count');

    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;

    let pairs = 0;
    let steps = 0;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        lockBoard = true;
        steps += 1;
        movesCount.textContent = steps;
        firstCard.dataset.image === secondCard.dataset.image ? disableCards() : unFlipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        resetBoard();
        pairs += 1;
        if (pairs === 6) {
            setTimeout(() => {
                gameEnd();
            }, 500)
        }
    }

    function unFlipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip')
            secondCard.classList.remove('flip')
            resetBoard();
        }, 500)
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    (function shuffle() {
        cards.forEach(card => {
            card.style.order = Math.floor(Math.random() * 12);
        })
    })();

    function gameEnd() {
        addScoreToLS(steps);
        document.querySelector('.endgame_popup__moves').textContent = steps;
        const endgame_wrapper = document.querySelector('.endgame_wrapper');
        endgame_wrapper.classList.add('open');
    }

    const restartBtn = document.querySelector('#restart');

    restartBtn.addEventListener('click', () => {
        document.querySelector('.endgame_wrapper').classList.remove('open');
        startGame(0)
    })

    cards.forEach(card => card.addEventListener('click', flipCard));
}

const scoreboardBtn = document.querySelector('#scoreboard_btn');
scoreboardBtn.addEventListener('click', () => {
    document.querySelector('.scoreboard_wrapper').classList.toggle('open');
    lastGameList();
})

document.addEventListener('click', (e) => {
    e.target.classList.contains('scoreboard_wrapper') ? document.querySelector('.scoreboard_wrapper').classList.toggle('open') : '';
})

document.querySelectorAll('.popup_close').forEach(item => {
    item.addEventListener('click', () => {
        console.log('close')
        document.querySelector('.open').classList.toggle('open');
    })
})


function addScoreToLS(score) {
    if (!localStorage.getItem('memoryGame')) {
        localStorage.setItem('memoryGame', JSON.stringify([]));
    }
    let oldArr = JSON.parse(localStorage.getItem('memoryGame'));
    oldArr.push(score);
    localStorage.setItem('memoryGame', JSON.stringify(oldArr));
}

function lastGameList() {
    let lastGameArr = JSON.parse(localStorage.getItem('memoryGame'));
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';
    lastGameArr.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>Game ${index + 1}</td>
                <td>${item}</td>`
        tbody.prepend(tr)
    })
}