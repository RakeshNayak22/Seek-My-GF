// Game settings
const GRID_SIZE = 5;
const MAX_ATTEMPTS = 5;

// Game state
let attempts = 0;
let score = 0;
let targetPosition = -1;
let gameOver = false;
let clickedTiles = [];
let firstClick = true;

// Get elements
const grid = document.getElementById('gameGrid');
const attemptsLeft = document.getElementById('attemptsLeft');
const scoreEl = document.getElementById('score');
const directionHint = document.getElementById('directionHint');
const emotionText = document.getElementById('emotionText');
const characterImg = document.getElementById('characterImg');
const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalStats = document.getElementById('modalStats');
const modalIcon = document.getElementById('modalIcon');
const modalImageContainer = document.getElementById('modalImageContainer');

// Girl image
const girlImage = 'girl1.jpg';


// Start game
function startGame() {
  createGrid();
  setTarget();
  updateUI();
}

// Create grid
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;
    tile.onclick = () => clickTile(i);
    grid.appendChild(tile);
  }
}

// Set random target
function setTarget() {
  targetPosition = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
}

// Click tile
function clickTile(index) {
  if (gameOver || clickedTiles.includes(index)) return;
  
  const tiles = document.querySelectorAll('.tile');
  tiles[index].classList.add('clicked');
  clickedTiles.push(index);
  
  if (index === targetPosition) {
    foundHer(tiles[index]);
  } else {
    missedHer(index);
  }
}

// Found her
function foundHer(tile) {
  gameOver = true;
  
  tile.classList.add('found');
  const img = document.createElement('img');
  img.src = girlImage;
  img.className = 'gf-img';
  tile.appendChild(img);
  
  characterImg.className = 'character-img character-very-excited';
  emotionText.innerHTML = '🎉 FOUND HER! 🎉';
  emotionText.style.color = '#ff0000';
  directionHint.innerHTML = '💖 YOU WIN! 💖';
  directionHint.style.color = '#ff0000';
  
  score = (MAX_ATTEMPTS - attempts) * 100;
  
  setTimeout(() => {
    showModal(
      '🎉 You Found Her! 🎉',
      'Congratulations! She loves you!',
      'Score: ' + score + ' points<br>Attempts: ' + (attempts + 1) + '/' + MAX_ATTEMPTS,
      '💖',
      true
    );
  }, 1000);
}

// Missed her
function missedHer(index) {
  attempts++;
  updateUI();
  
  if (firstClick) {
    firstClick = false;
  }
  
  showDirections(index);
  
  if (attempts >= MAX_ATTEMPTS) {
    gameOver = true;
    setTimeout(() => {
      revealTarget();
      showModal(
        '😢 Game Over!',
        'You ran out of attempts!',
        'She was waiting here for you!',
        '💔',
        false
      );
    }, 800);
  }
}

// Show directions
function showDirections(clickedIndex) {
  const distance = getDistance(clickedIndex, targetPosition);
  const direction = getDirection(clickedIndex, targetPosition);
  
  characterImg.classList.remove('character-excited', 'character-very-excited');
  
  if (distance === 1) {
    characterImg.classList.add('character-very-excited');
    emotionText.innerHTML = '🔥 SO CLOSE!';
    emotionText.style.color = '#ff0000';
    directionHint.innerHTML = '🔥 ' + direction;
    directionHint.style.color = '#ff0000';
  } else if (distance === 2) {
    characterImg.classList.add('character-excited');
    emotionText.innerHTML = '😃 Getting close!';
    emotionText.style.color = '#ff8800';
    directionHint.innerHTML = '🌡️ ' + direction;
    directionHint.style.color = '#ff8800';
  } else if (distance <= 4) {
    characterImg.classList.add('character-excited');
    emotionText.innerHTML = '🤔 Keep looking!';
    emotionText.style.color = '#ffaa00';
    directionHint.innerHTML = '😊 ' + direction;
    directionHint.style.color = '#ffaa00';
  } else {
    emotionText.innerHTML = '😐 Try another area';
    emotionText.style.color = '#999';
    directionHint.innerHTML = '❄️ ' + direction;
    directionHint.style.color = '#999';
  }
}

// Get distance
function getDistance(pos1, pos2) {
  const row1 = Math.floor(pos1 / GRID_SIZE);
  const col1 = pos1 % GRID_SIZE;
  const row2 = Math.floor(pos2 / GRID_SIZE);
  const col2 = pos2 % GRID_SIZE;
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

// Get direction
function getDirection(from, to) {
  const fromRow = Math.floor(from / GRID_SIZE);
  const fromCol = from % GRID_SIZE;
  const toRow = Math.floor(to / GRID_SIZE);
  const toCol = to % GRID_SIZE;
  
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  
  if (Math.abs(rowDiff) > Math.abs(colDiff)) {
    return rowDiff > 0 ? '⬇️ Go DOWN' : '⬆️ Go UP';
  } else {
    return colDiff > 0 ? '➡️ Go RIGHT' : '⬅️ Go LEFT';
  }
}

// Reveal target
function revealTarget() {
  const tiles = document.querySelectorAll('.tile');
  tiles[targetPosition].classList.add('found');
  const img = document.createElement('img');
  img.src = girlImage;
  img.className = 'gf-img';
  tiles[targetPosition].appendChild(img);
}

// Show modal
function showModal(title, message, stats, icon, showImage) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalStats.innerHTML = stats;
  modalIcon.textContent = icon;
  
  if (showImage) {
    modalImageContainer.innerHTML = '<div class="modal-img-container"><img src="' + girlImage + '" class="modal-img"></div>';
  } else {
    modalImageContainer.innerHTML = '';
  }
  
  modal.style.display = 'flex';
}

// Update UI
function updateUI() {
  attemptsLeft.textContent = MAX_ATTEMPTS - attempts;
  scoreEl.textContent = score;
}

// Reset game
function resetGame() {
  attempts = 0;
  score = 0;
  gameOver = false;
  clickedTiles = [];
  firstClick = true;
  
  modal.style.display = 'none';
  directionHint.innerHTML = '';
  emotionText.innerHTML = 'Click any tile!';
  emotionText.style.color = '';
  characterImg.className = 'character-img';
  
  createGrid();
  setTarget();
  updateUI();
}

// Start the game
startGame()