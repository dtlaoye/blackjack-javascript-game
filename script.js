// Blackjack Game Logic

// Global Variables
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameOver = false;

const suits = ["♠", "♥", "♣", "♦"];
const values = [
  "A",
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
];

// Initialize the game
function startGame() {
  gameOver = false;
  deck = createDeck();
  shuffleDeck(deck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  updateUI();
}

// Create a new deck
function createDeck() {
  let newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck;
}

// Shuffle deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Draw a card from the deck
function drawCard() {
  return deck.length > 0 ? deck.pop() : null;
}

// Calculate hand value
function calculateHand(hand) {
  let total = 0;
  let aceCount = 0;

  for (let card of hand) {
    if (card.value === "A") {
      aceCount++;
      total += 11;
    } else if (["J", "Q", "K"].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }

  // Adjust Aces from 11 to 1 if needed
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
}

// Player draws a card
function hit() {
  if (!gameOver) {
    playerHand.push(drawCard());
    if (calculateHand(playerHand) > 21) {
      gameOver = true;
    }
    updateUI();
  }
}

// Player stands, dealer plays
function stand() {
  while (calculateHand(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  gameOver = true;
  updateUI();
}

// Update UI elements
function updateUI() {
  document.getElementById("player-hand").textContent = `Player: ${displayHand(
    playerHand
  )}`;
  document.getElementById("dealer-hand").textContent = `Dealer: ${
    gameOver ? displayHand(dealerHand) : "[Hidden]"
  }`;
  document.getElementById("result").textContent = getGameResult();
}

// Display hand as text
function displayHand(hand) {
  return hand.map((card) => `${card.value}${card.suit}`).join(" ");
}

// Determine game result
function getGameResult() {
  let playerTotal = calculateHand(playerHand);
  let dealerTotal = calculateHand(dealerHand);

  if (playerTotal > 21) return "Bust! Dealer Wins!";
  if (dealerTotal > 21) return "Dealer Busts! You Win!";
  if (playerTotal > dealerTotal) return "You Win!";
  if (playerTotal < dealerTotal) return "Dealer Wins!";
  return "It's a Tie!";
}

// Start game on load
startGame();

document.getElementById("hit-btn").addEventListener("click", hit);
document.getElementById("stand-btn").addEventListener("click", stand);
document.getElementById("restart-btn").addEventListener("click", startGame);
