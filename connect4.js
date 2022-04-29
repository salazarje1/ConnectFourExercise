/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

const newGame = document.querySelector('button'); 
const htmlBoard = document.getElementById('board');

// New game - remove old game add new game
newGame.addEventListener('click',(e) => {
  htmlBoard.innerHTML = ''; 
  makeBoard();
  makeHtmlBoard();
})

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    board[i] = [];
    for(let j = 0; j < WIDTH; j++){
      board[i][j] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Create top row of game with id 'column-top' and add event listener
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // add number id for each top row cell.
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create row with HEIGHT, and create each cell and id and append to parent.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // debugger;
  for(let i = board.length-1; i >= 0; i--){
    for(let j = 0; j < board[i].length; i++){
      if(board[i][x] === 1 || board[i][x] === 2){
        break;
      } else {
        board[i][x] = currPlayer;
        return i;
      }
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement('div');
  if(currPlayer === 1){
    piece.classList.add('player1');
  } else if (currPlayer === 2){
    piece.classList.add('player2'); 
  }
  piece.classList.add('piece');
  document.getElementById(`${y}-${x}`).append(piece);
}

// function check for tie
const checkTie = (board) => {
  return board.every((el) => {
    for(let i = 0; i < el.length; i++){
      if(el[i] === null) return false; 
    }
    return true;
  })
}

/** endGame: announce game end */
function endGame(msg) {
  document.querySelector('#column-top').classList.add('no-click');
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let tie = checkTie(board);
  if(tie){
    endGame("It was a tie!")
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if(currPlayer === 1){
    currPlayer = 2; 
  } else {
    currPlayer = 1; 
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

// we run a for loop to get cells four in a row. 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // here we get horizontal cell starting 0, 0 and add 1 to each to get four in a row
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // here we get vertical cell starting 0, 0 and add 1 to each to get four in a row
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // here we get diagonal right cell starting 0, 0 and add 1 to each to get four in a row
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // here we get diagonal left cell starting 0, 0 and add 1 to each to get four in a row
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // then we run them through the _win function to see if either comeback as true. 
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
