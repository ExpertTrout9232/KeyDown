// First comment sussy baka Impostor

// Function to find the shortest path
import { shortestPathSearch } from './shortestPathSearch.js';

window.addEventListener('load', function() {
  const board = document.getElementById("game-board");
  let rows = 10;
  let cols = 10;

  let score = 0;
  let max_score = 0;
  let npc_cooldown = 1000;
  let moveNPCInterval;
  let total_coins = 0;
  let current_coins = 0;
  const circle = document.createElement("div");
  const NPC = document.createElement("div");
  circle.classList.add("circle");
  NPC.classList.add("npc");

  let game_board = [];
  let game_board_row = [];

  // Initialize the circle's position
  let x = 0;
  let y = 0;

  // Initialize the NPC's position
  let npc_x = 0;
  let npc_y = 0;

  // Show Game Over screen 
  function showGameOver() {
    let centeredText = document.getElementById('gameOverText');
    centeredText.style.display = 'block';
  }

  // Show blur effect 
  function showBlur() {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
  }

  // Hide Game Over screen 
  function hideGameOver() {
    let centeredText = document.getElementById('gameOverText');
    centeredText.style.display = 'none';
  }

  // Hide blur effect 
  function hideBlur() {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
  }

  // Check if the player can reach coins
  function checkCoinPossibility() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (game_board[i][j] == 2) {
          if (shortestPathSearch(game_board, i, j, y, x).length == 0) {
            return 1;
          }
        }
        if (game_board[i][j] == 3) {
          if (shortestPathSearch(game_board, i, j, y, x).length == 0) {
            return 1;
          }
        }
      }
    }
  }

  // Generate random game board
  function generateBoard() {
    current_coins = 0;
    do {
      total_coins = 0;
      game_board = [];
      for (let i = 0; i < rows; i++) {
        game_board_row = [];
        for (let j = 0; j < cols; j++) {
          game_board_row.push(0);
        }
        game_board.push(game_board_row);
      }
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let chooseRandom = Math.floor((Math.random() * 7) + 1);
          let chooseRandomCoin = Math.floor((Math.random() * 7) + 1);
          let chooseRandomPowerUp = Math.floor((Math.random() * 200) + 1);
          if (chooseRandom == 1) {
            game_board[i][j] = 1;
          } else if (chooseRandomCoin == 2) {
            game_board[i][j] = 2;
          } else if (chooseRandomPowerUp == 3) {
            game_board[i][j] = 3;
          }
        }
      }
      npc_x = Math.floor(Math.random() * 10);
      npc_y = Math.floor(Math.random() * 10);
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while ((shortestPathSearch(game_board, npc_y, npc_x, y, x).length < 7) || (checkCoinPossibility() == 1) || (game_board[npc_y][npc_x] == 1) || (game_board[npc_y][npc_x] == 2) || (game_board[npc_y][npc_x] == 3) || (game_board[y][x] == 1) || (game_board[y][x] == 2) || (game_board[y][x] == 3));
  }

  // Create the game board
  function createBoard() {
    board.innerHTML = '';
    generateBoard();
    for (let i = 0; i < rows; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement("td");
        row.appendChild(cell);
        if (game_board[i][j] == 1) {
          // Create a square element
          const square = document.createElement("div");
          let chooseRandom = Math.floor((Math.random() * 4) + 1);
          if (chooseRandom == 1) {
            square.classList.add("square1");
          } else if (chooseRandom == 2) {
            square.classList.add("square2");
          } else if (chooseRandom == 3) {
            square.classList.add("square3");
          } else if (chooseRandom == 4) {
            square.classList.add("square4");
          }
          cell.appendChild(square);
        }
        if (game_board[i][j] == 2) {
          // Create a coin element
          const coin = document.createElement("div");
          total_coins++;
          coin.classList.add("coin");
          cell.appendChild(coin);
        }
        if (game_board[i][j] == 3) {
          // Create a power-up element
          const powerup = document.createElement("div");
          powerup.classList.add("powerup");
          cell.appendChild(powerup);
        }
        board.appendChild(row);
      }
    }
    board.rows[y].cells[x].appendChild(circle);
    board.rows[npc_y].cells[npc_x].appendChild(NPC);
  }

  function checkCoin() {
    // Check if the coin is in the same position as the circle
    if (board.rows[y].cells[x].querySelector('.coin')) {
      score++;
      let currentCoin = board.rows[y].cells[x].querySelector('.coin');
      document.querySelector('.score-counter').textContent = score;
      board.rows[y].cells[x].removeChild(currentCoin);
      game_board[y][x] = 0;
      current_coins++;
      if (current_coins == total_coins) {
        clearInterval(moveNPCInterval);
        if (rows < 15) {
          rows++;
        }
        if (cols < 15) {
          cols++;
        }
        npc_cooldown = npc_cooldown * 0.9;
        moveNPCInterval = setInterval(moveNPC, npc_cooldown);
        createBoard();
      }
    }
  }

  function checkPowerUp() {
    // Check if the powerup is in the same position as the circle
    if (board.rows[y].cells[x].querySelector('.powerup')) {
      clearInterval(moveNPCInterval);
      let currentPowerUp = board.rows[y].cells[x].querySelector('.powerup');
      game_board[y][x] = 0;
      npc_cooldown += 50;
      board.rows[y].cells[x].removeChild(currentPowerUp);
      moveNPCInterval = setInterval(moveNPC, npc_cooldown);
    }
  }

  // Function to move the circle
  function moveCircle(event) {
    // Remove the circle from the current position

    let newX = x;
    let newY = y;

    switch (event.key) {
      case "ArrowUp":
        if (y > 0) {
          newY = y - 1;
        }
        break;
      case "ArrowDown":
        if (y < rows - 1) {
          newY = y + 1;
        }
        break;
      case "ArrowLeft":
        if (x > 0) {
          newX = x - 1;
        }
        break;
      case "ArrowRight":
        if (x < cols - 1) {
          newX = x + 1;
        }
        break;
    }

    if (game_board[newY][newX] != 1) {
      x = newX;
      y = newY
    }

    checkPowerUp();
    checkCoin();

    // Add the circle to the new position
    board.rows[y].cells[x].appendChild(circle);

    // Check if the NPC is on the same position as player
    checkKill();
  }

  function checkKill() {
    if (npc_x == x && npc_y == y) {
      board.rows[y].cells[x].removeChild(circle);
      document.removeEventListener("keydown", moveCircle);
      clearInterval(moveNPCInterval);
      let game_over_sound = new Audio("taco-bell-bong-sfx.mp3");
      game_over_sound.play();
      showGameOver();
      showBlur();
      if (score > max_score) {
        max_score = score;
      }
      let centered_text = document.getElementById('gameOverText');
      centered_text.innerHTML = "<h1>GAME OVER</h1><br><p>Press any key to play again</p><br><p>Total score:</p>" + score + "<p>Max score:</p>" + max_score;
      document.addEventListener("keydown", restart);
    }
  }

  // Function to move the NPC
  function moveNPC() {
    // Calculate the shortest path from the enemy to the player
    let path = shortestPathSearch(game_board, npc_y, npc_x, y, x);
    if (path.length > 0) {
      npc_x = path[1][1];
      npc_y = path[1][0];
    }
    board.rows[npc_y].cells[npc_x].appendChild(NPC);
    checkKill();
  }

  function init() {
    document.removeEventListener("keydown", init);

    let start_text = document.getElementById("waitForKey");
    start_text.style.display = 'none';
    
    // Listen for keyboard events
    document.addEventListener("keydown", moveCircle);

    moveNPCInterval = setInterval(moveNPC, npc_cooldown);
  }

  function restart() {
    rows = 10;
    cols = 10;
    score = 0;
    npc_cooldown = 1000;
    document.removeEventListener("keydown", restart);
    hideBlur();
    hideGameOver();
    let start_text = document.getElementById("waitForKey");
    start_text.style.display = 'block';
    document.addEventListener("keydown", init);
    createBoard();
  }

  function controls() {
    document.removeEventListener("keydown", controls);
    let controls_text = document.getElementById("controls");
    controls_text.style.display = 'none';
    let overlay = document.getElementById("overlay");
    overlay.style.display = 'none';
    document.addEventListener("keydown", init);
  }

  createBoard();
  
  document.addEventListener("keydown", controls);
});

// Last comment