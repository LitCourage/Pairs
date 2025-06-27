import './style.css'

// CONSTANTS

const cardImagesObj = {
    star: '<i class="fa-solid fa-star fa-2x"></i>',
    cloud: '<i class="fa-solid fa-cloud fa-2x"></i>',
    phone: '<i class="fa-solid fa-phone fa-2x"></i>',
    paperclip: '<i class="fa-solid fa-paperclip fa-2x"></i>',
    bomb: '<i class="fa-solid fa-bomb fa-2x"></i>',
    heart: '<i class="fa-solid fa-heart fa-2x"></i>',
    umbrella: '<i class="fa-solid fa-umbrella fa-2x"></i>',
    gear: '<i class="fa-solid fa-gear fa-2x"></i>',
    lightning: '<i class="fa-solid fa-bolt fa-2x"></i>',
    car: '<i class="fa-solid fa-car fa-2x"></i>',
    gift: '<i class="fa-solid fa-gift fa-2x"></i>',
    ghost: '<i class="fa-solid fa-ghost fa-2x"></i>',
    bell: '<i class="fa-solid fa-bell fa-2x"></i>',
    tree: '<i class="fa-solid fa-tree fa-2x"></i>',
    sun: '<i class="fa-solid fa-sun fa-2x"></i>',
    feather: '<i class="fa-solid fa-feather fa-2x"></i>',
    fish: '<i class="fa-solid fa-fish fa-2x"></i>',
    drop: '<i class="fa-solid fa-droplet fa-2x"></i>',
    question: '<i class="fa-solid fa-circle-question fa-2x"></i>'
};
const cardImages = Object.values(cardImagesObj);
const timeLimits = {
    2: 10,
    4: 45,
    6: 110
}

// GAME VARIABLES

let pairsQuantity;
let foundPairs;
let maxPairs;
let steps;
let time;
let activeCard;
let canClick;
let canPlay;
let timeCounter = setInterval(() => {});

// UTIL FUNCTIONS

function setup() {
    pairsQuantity = 2;
    foundPairs = 0;
    maxPairs = 0;
    steps = 0;
    time = 60;
    activeCard = null;
    canClick = true;
    canPlay = true;
    clearInterval(timeCounter);
}

function addClickListener(selector, callback) {document.querySelector(selector).addEventListener('click', (event) => {callback(event)})}

function changeElementText(selector, text) {document.querySelector(selector).innerText = text}

function isEven(num) {
    return (num % 2 === 0);
}

function random(min, max) {return min + Math.floor(Math.random() * max)}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

// GAME FUNCTIONS

function handleVictory() {
    clearInterval(timeCounter);
    setTimeout(() => {
        alert('You won!')
    }, 1500)
}

function handleFoudPair(card_el) {
    setTimeout(() => {
        activeCard.classList.remove('game-card-active')
        card_el.classList.remove('game-card-active')
        activeCard.classList.add('game-card-ready')
        card_el.classList.add('game-card-ready')
        activeCard = null;
        canClick = true;
    }, 1000)
}

function handleTimeOut() {
    alert('The time is over!')
    canPlay = false;
}

function handleStepEnd(card_el) {
    setTimeout(() => {
        activeCard.classList.remove('game-card-active')
        card_el.classList.remove('game-card-active')
        card_el.innerHTML = cardImagesObj.question
        activeCard.innerHTML = cardImagesObj.question
        activeCard = null;
        canClick = true;
    }, 1000);
}

function createPair(cardId) {
    const card1_el = document.createElement('div');
    const card2_el = document.createElement('div');
    card1_el.className = 'game-card centring'
    card2_el.className = 'game-card centring'
    card1_el.id = `${cardId}`
    card2_el.id = `${cardId + 1}`
    card1_el.innerHTML = cardImagesObj.question
    card2_el.innerHTML = cardImagesObj.question
    card1_el.addEventListener('click', (event) => checkForPair(event.currentTarget))
    card2_el.addEventListener('click', (event) => checkForPair(event.currentTarget))
    return [card1_el, card2_el];
}

function checkForPair(card_el) {
    if (card_el === activeCard || !canClick || card_el.classList.contains('game-card-ready') || !canPlay) {return}

    const id = parseInt(card_el.id);
    card_el.classList.add('game-card-active');
    card_el.innerHTML = cardImages[(isEven(id) ? id : id - 1) / 2];

    if (!activeCard) {
        activeCard = card_el;
    } else {
        const activeId = parseInt(activeCard.id);
        canClick = false;
        steps++;
        changeElementText('.game-steps', `steps: ${steps}`);
        if (activeId === (isEven(id) ? id + 1 : id - 1)) {
            handleFoudPair(card_el);
            if (++foundPairs >= maxPairs) {
                handleVictory();
            }
            return;
        }
        handleStepEnd(card_el);
    }
}

function loadGameField(pairsQuantity) {
    document.querySelector('.entry-form-container').hidden = true;
    document.querySelector('.game-container').hidden = false;
    document.querySelector('body').style.setProperty('--pairsQuantity', pairsQuantity);
    const gameField = document.querySelector('.game-field');

    gameField.innerHTML = '';

    time = timeLimits[pairsQuantity];
    maxPairs = pairsQuantity**2 / 2;

    const cardsList = []

    for (let cardId = 0; cardId < pairsQuantity**2; cardId += 2) {
        const [card1_el, card2_el] = createPair(cardId);
        cardsList.push(card1_el);
        cardsList.push(card2_el);
    }

    shuffle(cardsList);
    cardsList.forEach((card) => {gameField.append(card)})

    changeElementText('.game-time', `time: ${time}`);
    timeCounter = setInterval(() => {
        time--;
        if (time < 0) {
            clearInterval(timeCounter);
            handleTimeOut(timeCounter);
            return;
        }
        changeElementText('.game-time', `time: ${time}`);
    }, 1000)
}

function loadStartMenu() {
    document.querySelector('.entry-form-container').hidden = false;
    document.querySelector('.game-container').hidden = true;

    setup()
}



document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    loadGameField(pairsQuantity);
})
document.querySelector('.entry-form label input').addEventListener('input', (event) => {
    pairsQuantity = event.target.value;
    document.querySelector('#pairs-quantity').innerText = pairsQuantity;
})
addClickListener('.play-again-button', () => {loadStartMenu()})

loadStartMenu()