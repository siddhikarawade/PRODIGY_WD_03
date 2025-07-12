const selectBox = document.querySelector(".select-box"),
      selectXBtn = selectBox.querySelector(".playerX"),
      selectOBtn = selectBox.querySelector(".playerO"),
      playBoard = document.querySelector(".play-board"),
      allBox = document.querySelectorAll("section span"),
      players = document.querySelector(".players"),
      resultBox = document.querySelector(".result-box"),
      wonText = document.querySelector(".won-text"),
      replayBtn = document.querySelector(".btn button"),
      playAIButton = document.querySelector(".play-ai"),
      playPlayerButton = document.querySelector(".play-player"),
      playerSelectTitle = document.querySelector(".player-select-title"),
      playerOptions = document.querySelector(".player-select-options");

let playerXIcon = "fas fa-times";
let playerOIcon = "fas fa-circle";
let playerSign = "X";           // current player
let userPlayer = "X";           // human selected symbol
let playWithAI = true;
let runGame = true;

// Game Mode Selection
playAIButton.onclick = () => {
  playWithAI = true;
  playAIButton.classList.add("active-mode");
  playPlayerButton.classList.remove("active-mode");
  playerSelectTitle.classList.remove("hide");
  playerOptions.classList.remove("hide");
};

playPlayerButton.onclick = () => {
  playWithAI = false;
  playPlayerButton.classList.add("active-mode");
  playAIButton.classList.remove("active-mode");
  playerSelectTitle.classList.remove("hide");
  playerOptions.classList.remove("hide");
};

// Start Game - Player X
selectXBtn.onclick = () => {
  userPlayer = "X";
  playerSign = "X";
  selectBox.classList.add("hide");
  playBoard.classList.add("show");
  players.classList.remove("active");

  // if AI is O, do nothing (X starts)
};

// Start Game - Player O
selectOBtn.onclick = () => {
  userPlayer = "O";
  playerSign = "O";
  selectBox.classList.add("hide");
  playBoard.classList.add("show");
  players.classList.add("active");

  // If AI is X, AI should make the first move
if (playWithAI) {
  playerSign = "X"; // AI is X and goes first
  players.classList.remove("active"); // Set indicator to X's turn
  playBoard.style.pointerEvents = "none";
  setTimeout(botMove, Math.floor(Math.random() * 800 + 200));
}
};

// Enable board clicks
window.onload = () => {
  for (let i = 0; i < allBox.length; i++) {
    allBox[i].setAttribute("onclick", "clickBox(this)");
  }
};

// Handle Box Click (Human move)
function clickBox(element) {
  if (!runGame || element.innerHTML !== "") return;

  const icon = playerSign === "X" ? playerXIcon : playerOIcon;
  element.innerHTML = `<i class="${icon}" style="animation: pop 0.2s ease;"></i>`;
  element.setAttribute("id", playerSign);
  element.style.pointerEvents = "none";

  selectWinner();
  if (!runGame) return;

  toggleTurn();

  // If playing AI and it's AI's turn, call bot
  if (playWithAI && playerSign !== userPlayer) {
    playBoard.style.pointerEvents = "none";
    setTimeout(botMove, Math.floor(Math.random() * 800 + 200));
  }
}

// Toggle between X and O
function toggleTurn() {
  playerSign = playerSign === "X" ? "O" : "X";
  players.classList.toggle("active");
}

// Bot/AI Move
function botMove() {
  if (!runGame) return;

  let emptyBoxes = Array.from(allBox).filter(box => box.childElementCount === 0);
  if (emptyBoxes.length === 0) return;

  let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  const icon = playerSign === "X" ? playerXIcon : playerOIcon;
  randomBox.innerHTML = `<i class="${icon}" style="animation: pop 0.2s ease;"></i>`;
  randomBox.setAttribute("id", playerSign);
  randomBox.style.pointerEvents = "none";

  selectWinner();
  if (!runGame) return;

  // Toggle player and update indicator
  toggleTurn();
  playBoard.style.pointerEvents = "auto";
}


// Check for winner
function getClass(id) {
  return document.querySelector(".box" + id).id;
}

function checkClass(a, b, c, sign) {
  return getClass(a) === sign && getClass(b) === sign && getClass(c) === sign;
}

function selectWinner() {
  const wins = [
    [1,2,3], [4,5,6], [7,8,9],
    [1,4,7], [2,5,8], [3,6,9],
    [1,5,9], [3,5,7]
  ];

  for (let [a, b, c] of wins) {
    if (checkClass(a, b, c, playerSign)) {
      runGame = false;
      setTimeout(() => {
        playBoard.classList.remove("show");
        resultBox.classList.add("show");
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
      }, 700);
      return;
    }
  }

  if ([...allBox].every(box => box.childElementCount > 0)) {
    runGame = false;
    setTimeout(() => {
      playBoard.classList.remove("show");
      resultBox.classList.add("show");
      wonText.innerHTML = `Match has been drawn`;
    }, 700);
  }
}

// Restart game
replayBtn.onclick = () => window.location.reload();
