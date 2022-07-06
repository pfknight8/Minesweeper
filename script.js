//Javascript file for minesweeper game. GA-project 1, Patrick Knight

//////////////////////
// Global Variables //
//////////////////////

//start
let gameOver = true;
let flagCount = 0;
const easyBtn = document.querySelector('#easy');
const medBtn = document.querySelector('#med');
const advBtn = document.querySelector('#hard');
const flagCounter = document.getElementById('flagCount');
const startBtnHTML = document.querySelectorAll('.startBtn');
const gameMsg = document.getElementById('resultMsg');

//////////////////////
// Functions        //
//////////////////////

//Creates a grid matrix, such as [[j0, j1, j2,], [j0, j1, j2], [j0, j1, j2]] where each set of 'j' is an an index of 'i'.
const makeGrid = (numRows, numCols) => {
  //create a grid stored as a matrix (array of arrays).
  let gridMatix = [];
  for (let i = 0; i < numRows; i++) {
    let innerArray = [];
    for (let j = 0; j < numCols; j++) {
      innerArray[j] = null;
    }
    gridMatix[i] = innerArray;
  }
  return gridMatix;
}

//Takes an array and places a set number of bombs within them.
const populateGrid = (gameGrid, numBombs) => {
  while (numBombs > 0) {
    let i = Math.floor(Math.random()*gameGrid.length);
    let j = Math.floor(Math.random()*gameGrid[0].length); //assumes all inner arrays have same length.
    if (gameGrid[i][j] === null) {
      gameGrid[i][j] = 'bb';
      numBombs--;
    }
  }
  return gameGrid;
}

//Evaluate the array to place number of nearby 'bombs' in the game grid.
const lookNearby = (gameGridMined) => {
  let iMin = 0;
  let jMin = 0;
  let iMax = gameGridMined.length - 1;
  let jMax = gameGridMined[0].length - 1;
  let bombCount = 0;
  for (let i=0; i<=iMax; i++) {
    for (let j=0; j<=jMax; j++) {
      if (gameGridMined[i][j] === 'bb') {
        //Skip over 'bombs';
      } else if (i>0 && i<iMax) {
        // for the "body" of the grid
        for (let rowIn=i-1; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip if cell doesn't exist
            } else {
              if(gameGridMined[rowIn][colIn] === 'bb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGridMined[i][j] = bombCount;
        bombCount = 0;
      } else if (i == 0) {
        // for the top row
        for (let rowIn=i; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip if cell doesn't exish
            } else {
              if(gameGridMined[rowIn][colIn] === 'bb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGridMined[i][j] = bombCount;
        bombCount = 0;
      } else if (i == iMax) {
        // for the bottom row
        for (let rowIn=i-1; rowIn<=i; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGridMined[rowIn][colIn] === 'bb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGridMined[i][j] = bombCount;
        bombCount = 0;
      }
    }
  }
  return gameGridMined;
}

// Create divs in html to hold the game grid & buttons
const divMatrix = (gameGridReady) => {
  let rowMax = gameGridReady.length;
  let colMax = gameGridReady[0].length;
  for (let k=0; k<rowMax; k++) {
    let newDivRow = document.createElement('div');
    newDivRow.id = `row${k}`;
    newDivRow.classList.add('gameRows');
    for (let x=0; x<colMax; x++) {
      let newDivCell = document.createElement('div');
      newDivCell.id = `cell${k}-${x}`;
      newDivCell.classList.add('gameCell');
      let newP = document.createElement('p');
      newP.classList.add('cellValue');
      newP.id = `value${k}-${x}`;
      newP.innerHTML = gameGridReady[k][x];
      if (newP.innerHTML === 'bb') {
        newDivCell.classList.add('bomb');
      }
      newDivCell.appendChild(newP);
      cellBtn = makeBtn(k, x, gameGridReady); //1st event listener
      //Add double-click feature;
      if (newDivCell.innerHTML !== 'bb' && newDivCell.innerHTML !== 0) {
        //count nearby flagged vs bomb
        newDivCell.addEventListener('dblclick', () => {
          let adjFlagged = 0;
          let adjBomb = 0;
          for (let kIn=k-1; kIn<=k+1; kIn++) {
            if (kIn<0 || kIn>=rowMax) {
              //Skip nonexistant
            } else { 
              for (let xIn=x-1; xIn<=x+1; xIn++) {
                if (xIn<0 || xIn>=colMax) {
                  //Skip nonexistant
                } else {
                  if (kIn===k && xIn===x) {
                    //Skip over same cell
                  } else {
                    //get flagged button count.
                    let nextBtn = document.getElementById(`gridBtn${kIn}-${xIn}`);
                    if (nextBtn.classList.contains('flagged')) {
                      adjFlagged += 1;
                    }
                  }
                }
              }
            }
          }
          // console.log(adjFlagged + " " + newP.innerHTML);
          if (adjFlagged == newP.innerHTML) {
            clickAdjacent(k, x, gameGridReady);
          }
        });
      }
      newDivCell.appendChild(cellBtn);
      newDivRow.appendChild(newDivCell);
    }
    console.log(newDivRow);
    document.querySelector('#gridBody').appendChild(newDivRow);
  }
}

  //Check to see if the game has been won
const gameStatus = (gameGridReady) => {
  let incorrectMark = 0;
  let correctMark = 0;
  let unclickedTiles = 0;
  //Count Bombs
  let bombsTotal = 0;
  for (let i=0; i<gameGridReady.length; i++) {
    for (let j=0; j<gameGridReady[0].length; j++) {
      if (gameGridReady[i][j] === 'bb') {
        bombsTotal += 1;
      }
    }
  }
  //Count 'flag', 'bomb', and 'hidden' conditions of board to see if game has eneded (win; loss is in the eventlistener).
  for (let i=0; i<gameGridReady.length; i++) {
    for (let j=0; j<gameGridReady[0].length; j++) {
      let evalBtn = document.getElementById(`gridBtn${i}-${j}`);
      if (evalBtn.classList.contains('flagged') && gameGridReady[i][j] !== 'bb') {
        incorrectMark += 1;
      } else if (evalBtn.classList.contains('flagged') && gameGridReady[i][j] === 'bb') {
        correctMark += 1;
      } else if (gameGridReady[i][j] !== 'bb' && evalBtn.style.visibility !== 'hidden') {
        unclickedTiles += 1;
      }
    }
  }
  if (correctMark === bombsTotal && incorrectMark === 0 && unclickedTiles ===0) {
    gameMsg.innerHTML = "Win!";
    gameOver = true;
  }
}

//Function to initiate click on adjacent tiles.
const clickAdjacent = (index1, index2, gameGridReady) => {
  let maxRowIndex = gameGridReady.length-1;
  let maxColIndex = gameGridReady[0].length-1;
  //Start 'click' on all nearby tiles.
  for (let a=index1-1; a<=index1+1; a++) {
    if (a < 0 || a > maxRowIndex) {
      //Skip if row doesn't exist
    } else {
      for (let b=index2-1; b<=index2+1; b++) {
        if (b < 0 || b > maxColIndex) {
          //Skip if column doesn't exist
        } else {
          if (a === index1 && b === index2) {
            //Skip if in the same cell.
          } else {
            //Emulate the click.
            let nextBtn = document.getElementById(`gridBtn${a}-${b}`);
            if (nextBtn.style.visibility !== 'hidden') {
              nextBtn.click();
            }
          }
        }
      }
    }
  }
}

// Initiates game; resets gridBody, 'flag' count, and gameOver, while disabling game level options.
const startGame = (gridRow, gridCol, bombs) => {
  if (gameOver) {
    gameOver = false;
    document.getElementById('gridBody').innerHTML = "";
    flagCount =0;
    flagCounter.innerHTML = 0;
    gameMsg.innerHTML = "Game Time!";
    document.getElementById('bombCount').innerHTML = bombs;
    let gameGrid = makeGrid(gridRow, gridCol);
    divMatrix(lookNearby(populateGrid(gameGrid, bombs)));
    Array.from(startBtnHTML).forEach(element => {
      element.style.pointerEvents = 'none';
    });
  } //else do nothing
}

//////////////////////
// Event Listeners  //
//////////////////////

//Make buttons and place them into the grid with event listeners.
const makeBtn = (index1, index2, gameGridReady) => {
  let newBtn = document.createElement('button');
  newBtn.id = `gridBtn${index1}-${index2}`;
  newBtn.classList.add('gameBtn');
  newBtn.addEventListener(('click'), (e) => {
    //See if the there is a bomb at the grid coordinate, else if 0 start click events on neighbors, else reveal tile and stop.
    if (e.shiftKey === true) {
      if (newBtn.classList.contains('flagged')) {
        newBtn.classList.remove('flagged');
        flagCount -= 1;
      } else {
        newBtn.classList.add('flagged');
        flagCount += 1;
      }
      flagCounter.innerHTML = flagCount;
    } else {
      let targetCell = document.getElementById(`cell${index1}-${index2}`);
      if (newBtn.classList.contains('flagged')) {
        //Do Nothing!
        return;
      } else if (gameGridReady[index1][index2] === 'bb') {
        gameMsg.innerHTML = 'Oh no, you died! Game Over!';
        targetCell.style.color = 'transparent';
        targetCell.style.backgroundColor = 'orangered';
        gameOver = true;
      } else if(gameGridReady[index1][index2] == 0) {
        targetCell.style.color = 'transparent';
        //Start 'click' on all nearby tiles.
        clickAdjacent(index1, index2, gameGridReady);
      } else {
        switch(gameGridReady[index1][index2]) {
          case 1:
            targetCell.style.color = 'blue';
            break;
          case 2:
            targetCell.style.color = 'darkgreen';
            break;
          case 3:
            targetCell.style.color = 'firebrick';
            break;
          case 4:
            targetCell.style.color = 'indigo';
            break;
          case 5:
            targetCell.style.color = 'brown';
            break;
          case 6:
            targetCell.style.color = 'chartreuse';
            break;
          case 7:
            targetCell.style.color = 'goldenrod';
            break;
          case 8:
            targetCell.style.color = 'blueviolet';
            break;
        }
      }
      newBtn.style.visibility = 'hidden';
      document.getElementById(`value${index1}-${index2}`).style.display = 'block';
    }
    gameStatus(gameGridReady);
    if (gameOver) {
      let buttonsOff = document.getElementsByClassName('gameBtn');
      Array.from(buttonsOff).forEach(element => {
        element.style.pointerEvents = 'none';
      });
      Array.from(startBtnHTML).forEach(element => {
        element.style.pointerEvents = 'auto';
      });
    }
  });
  // newBtn.addEventListener(('auxclick'), () => {});
  return newBtn;
}

easyBtn.addEventListener('click', () => {
  startGame(8, 8, 8);
});

medBtn.addEventListener('click', () => {
  startGame(16, 14, 40);
});

advBtn.addEventListener('click', () => {
  startGame(30, 16, 99);
});


//////////////////////
// Other Notes      //
//////////////////////

// //This will be set to a start game button. Use to test for now.
// let gameGrid = makeGrid(8, 8);
// // console.log(gameGrid);
// // console.log(gameGrid[2].length);
// let gameGridMined = lookNearby(populateGrid(gameGrid, 8));
// console.log(gameGridMined);
// divMatrix(gameGridMined);
