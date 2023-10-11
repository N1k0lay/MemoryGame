fetch('./levels.json')
    .then(res => res.json())
    .then(data => renderBoard(data[0]));


function renderBoard(data) {
    const board = document.querySelector('.memory_game');
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

    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;

    let pairs = 0;

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
        firstCard.dataset.image === secondCard.dataset.image ? disableCards() : unFlipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        resetBoard();
        pairs += 1;
        if(pairs === 6) {
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

    function gameEnd () {
        alert('Игра закончена')
    }

    cards.forEach(card => card.addEventListener('click', flipCard));
}


