const readlineSync = require('readline-sync');

// Initializes a 10x10 game board
function initializeBoard() {
  return new Array(10).fill(null).map(() => new Array(10).fill('.'));
}

// Randomly places ships on the board
// For simplicity, this example won't actually place ships but will mark a single ship for demonstration

function placeShips(board) {
  const ships = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 }
  ];

  ships.forEach(ship => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 10; // Set a reasonable limit for attempts

    while (!placed && attempts < maxAttempts) {
      console.log(`Place your ${ship.name} (Length: ${ship.length})`);
      const position = readlineSync.question('Enter starting position (e.g., A5): ');
      const orientation = readlineSync.question('Enter orientation (h for horizontal, v for vertical): ');
      
      const { row, col } = positionToCoordinates(position);
      
      if (isValidPlacement(board, row, col, ship.length, orientation)) {
        markShipOnBoard(board, row, col, ship.length, orientation);
        placed = true;
      } else {
        console.log('Invalid placement. Try again.');
        attempts++;
      }
    }

    if (attempts >= maxAttempts) {
      console.log(`Failed to place ${ship.name} after ${maxAttempts} attempts.`);
      // Handle the failure case, e.g., by throwing an error or simply continuing to the next ship
    }
  });
}

function positionToCoordinates(position) {
  if (typeof position !== 'string' || position.length === 0) {
    console.error('Invalid position:', position);
    return { row: -1, col: -1 }; // Return an error value or handle this case as appropriate
  }
  const row = position.charCodeAt(0) - 'A'.charCodeAt(0); // Convert 'A'-'J' to 0-9
  const col = parseInt(position.substring(1)) - 1; // Convert '1'-'10' to 0-9
  return { row, col };
}

function isValidPlacement(board, row, col, length, orientation) {
  // Check if starting position is within the board
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return false;

  if (orientation === 'h') {
    // Check if ship goes off the right edge
    if (col + length > board[0].length) return false;
    for (let i = 0; i < length; i++) {
      // Check for overlap
      if (board[row][col + i] !== '.') return false;
    }
  } else { // 'v'
    // Check if ship goes off the bottom edge
    if (row + length > board.length) return false;
    for (let i = 0; i < length; i++) {
      // Check for overlap
      if (board[row + i][col] !== '.') return false;
    }
  }
  return true;
}

function markShipOnBoard(board, row, col, length, orientation) {
  if (orientation === 'h') {
    for (let i = 0; i < length; i++) {
      board[row][col + i] = 'S'; // Mark horizontal ship
    }
  } else { // 'v'
    for (let i = 0; i < length; i++) {
      board[row + i][col] = 'S'; // Mark vertical ship
    }
  }
}

// Additional functions needed:
// - positionToCoordinates(position): Converts a position string (e.g., "A5") to board coordinates.
// - isValidPlacement(board, row, col, length, orientation): Checks if the ship can be placed at the specified position.
// - markShipOnBoard(board, row, col, length, orientation): Marks the ship's position on the board.

// Returns a string representation of the board
function displayBoard(board, showShips) {
  return board.map(row => row.map(cell => {
    if (cell === 'S') return showShips ? 'S' : '.'; // Show ships only if showShips is true
    return cell; // Show the cell as it is (hit, miss, or water)
  }).join('')).join('\n');
}

// Main method to start the Battleship game
function main() {
  console.log("Welcome to Battleship!");

  // Initialize the game boards
  const playerBoard = initializeBoard();
  const opponentBoard = initializeBoard();
  console.log("Boards initialized.");

  // Place ships on both boards
  placeShips(playerBoard);
  placeShips(opponentBoard); // Assuming you have a mechanism to place ships for the opponent
  console.log("Ships placed on both boards.");

  // Display the player's board with ships visible
  console.log("Your game board with ships:");
  console.log(displayBoard(playerBoard, true)); // true to show ships

  // Display the opponent's board with ships hidden
  console.log("Opponent's game board:");
  console.log(displayBoard(opponentBoard, false)); // false to hide ships

  // Game logic (player turns, checking for hits/misses, etc.) would go here

  console.log("Game started. Good luck!");
}

// Ensure the main method is called when the script is executed
if (require.main === module) {
  main();
}

// At the bottom of battleship.js, update the module.exports statement
module.exports = { initializeBoard, placeShips, displayBoard, positionToCoordinates };