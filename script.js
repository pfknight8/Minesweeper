//Javascript file for minesweeper game. GA-project 1, Patrick Knight

//////////////////////
// Global Variables //
//////////////////////

//start
let gameOver = true;
let hitABomb = false;
let flagCount = 0;
const easyBtn = document.querySelector('#easy');
const medBtn = document.querySelector('#med');
const advBtn = document.querySelector('#hard');
const flagCounter = document.getElementById('flagCount');
const startBtnHTML = document.querySelectorAll('.startBtn');

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
      gameGrid[i][j] = 'bomb';
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
      if (gameGridMined[i][j] === 'bomb') {
        //Skip
      } else if (i>0 && i<iMax) {
        for (let rowIn=i-1; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGridMined[rowIn][colIn] === 'bomb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGridMined[i][j] = bombCount;
        bombCount = 0;
      } else if (i == 0) {
        for (let rowIn=i; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGridMined[rowIn][colIn] === 'bomb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGridMined[i][j] = bombCount;
        bombCount = 0;
      } else if (i == iMax) {
        for (let rowIn=i-1; rowIn<=i; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGridMined[rowIn][colIn] === 'bomb') {
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

// Create divs -- test working live, will need to put into a function:
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
      newDivCell.appendChild(newP);
      cellBtn = makeBtn(k, x, gameGridReady);
      newDivCell.appendChild(cellBtn);
      newDivRow.appendChild(newDivCell);
    }
    console.log(newDivRow);
    document.querySelector('#gridBody').appendChild(newDivRow);
  }
}

const gameStatus = (gameGridReady) => {
  //Checks to see if the game has been won
  // let evalBtns = document.getElementsByClassName('gameBtn');
  let incorrectMark = 0;
  let correctMark = 0;
  let unclickedTiles = 0;
  //Count Bombs
  let bombsTotal = 0;
  for (let i=0; i<gameGridReady.length; i++) {
    for (let j=0; j<gameGridReady[0].length; j++) {
      if (gameGridReady[i][j] === 'bomb') {
        bombsTotal += 1;
      }
    }
  }
  for (let i=0; i<gameGridReady.length; i++) {
    for (let j=0; j<gameGridReady[0].length; j++) {
      let evalBtn = document.getElementById(`gridBtn${i}-${j}`);
      if (evalBtn.classList.contains('flagged') && gameGridReady[i][j] !== 'bomb') {
        incorrectMark += 1;
      } else if (evalBtn.classList.contains('flagged') && gameGridReady[i][j] === 'bomb') {
        correctMark += 1;
      } else if (gameGridReady[i][j] !== 'bomb' && evalBtn.style.visibility !== 'hidden') {
        unclickedTiles += 1;
      }
    }
  }
  if (correctMark === bombsTotal && incorrectMark === 0 && unclickedTiles ===0) {
    alert("Win!");
    gameOver = true;
  }
}

const startGame = (gridRow, gridCol, bombs) => {
  if (gameOver) {
    gameOver = false;
    document.getElementById('gridBody').innerHTML = "";
    flagCount =0;
    flagCounter.innerHTML = 0;
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
  let maxRowIndex = gameGridReady.length-1;
  let maxColIndex = gameGridReady[0].length-1;
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
      if (newBtn.classList.contains('flagged')) {
        //Do Nothing!
        return;
      } else if (gameGridReady[index1][index2] === 'bomb') {
        alert('Oh no, you died! Game Over!');
        document.getElementById(`cell${index1}-${index2}`).style.backgroundColor = 'orange';
        hitABomb = true;
        gameOver = true;
      } else if(gameGridReady[index1][index2] == 0) {
        //Start 'click' on all nearby tiles.
        for (let a=index1-1; a<=index1+1; a++) {
          if (a < 0 || a > maxRowIndex) {
            //Skip
          } else {
            for (let b=index2-1; b<=index2+1; b++) {
              if (b < 0 || b > maxColIndex) {
                //Skip
              } else {
                if (a === index1 && b === index2) {
                  //Skip
                } else {
                  //Emulate the click. Could also set element style to change txt color (goal to hide 0).
                  let nextBtn = document.getElementById(`gridBtn${a}-${b}`);
                  if (newBtn.style.visibility !== 'hidden') {
                    nextBtn.click();
                  }
                }
              }
            }
          }
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

// To test.
// {
//   for (let g=0; g<1; g++) {
//     for (let h=0; h<8; h++) {
//       //
//       document.getElementById(`cell${g}-${h}`).innerHTML = "bomb"
//     }
//   }
// }
// The above needs to go into a function.


// Create function to flag tiles with 'alternate click'; can add/remove a 'flagged' class to the button, preferably adding a graphic to the inside.

// Need to check winning conditions: set global variable for 'game over' and 'hitbomb' where both being true means a loss, 'game over' true and 'hitbomb' false means win. 'game over' will have to check that all tiles are either 'hidden' or 'flagged'...may need to check that only bombs are flagged: check that all 'bomb' are flagged and that all non-'bomb' tiles are 'hidden' and not 'flag'.

//Double click on a number to reveal all neighboring tiles: Would have to assign to grid div with number value, then it would have to check neighboring cells to see if still have buttons, then would check if number of buttons with 'flagged' class matches its count, then initiate click on all non-hidden tiles around it.