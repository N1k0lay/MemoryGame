const cards = document.querySelectorAll('.memory_card');

function flipCard() {
    this.classList.add('flip');
}

cards.forEach(card => card.addEventListener('click', flipCard));

