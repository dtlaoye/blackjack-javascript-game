// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDpG7dDjrqV9ADVdT6hxvr9aRSfYhRC0sM",
  authDomain: "cpeg-cd8d7.firebaseapp.com",
  databaseURL: "https://cpeg-cd8d7.firebaseio.com",
  projectId: "cpeg-cd8d7",
  storageBucket: "cpeg-cd8d7.appspot.com",
  messagingSenderId: "1067230698036",
  appId: "1:1067230698036:web:179eb593d4e658e8660861",
  measurementId: "G-D6PYXP9ZVP",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const startButton = document.getElementById("start-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

let deck = [];
let playerHand = [];
let dealerHand = [];

startButton.addEventListener("click", startGame);
hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", playerStand);

function createDeck() {
  const suits = ["♥", "♦", "♣", "♠"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push(`${value}${suit}`);
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function startGame() {
  createDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  updateUI();
  hitButton.disabled = false;
  standButton.disabled = false;
}

function drawCard() {
  return deck.pop();
}

function updateUI() {
  document.getElementById("player-hand").textContent =
    "Player: " + playerHand.join(", ");
  document.getElementById("dealer-hand").textContent =
    "Dealer: " + dealerHand.join(", ");
}

function playerHit() {
  playerHand.push(drawCard());
  updateUI();
  if (calculateHandValue(playerHand) > 21) {
    document.getElementById("result").textContent =
      "Player Busts! Dealer Wins!";
    disableButtons();
  }
}

function playerStand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  determineWinner();
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    let cardValue = card.slice(0, -1);
    if (["J", "Q", "K"].includes(cardValue)) {
      value += 10;
    } else if (cardValue === "A") {
      aces++;
      value += 11;
    } else {
      value += parseInt(cardValue);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

function determineWinner() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  let result = "";

  if (playerValue > 21) {
    result = "Player Busts! Dealer Wins!";
  } else if (dealerValue > 21) {
    result = "Dealer Busts! Player Wins!";
  } else if (playerValue > dealerValue) {
    result = "Player Wins!";
  } else if (playerValue < dealerValue) {
    result = "Dealer Wins!";
  } else {
    result = "Push!";
  }
  document.getElementById("result").textContent = result;
  disableButtons();
}

function disableButtons() {
  hitButton.disabled = true;
  standButton.disabled = true;
}
