//Javascript file for minesweeper game. GA-project 1, Patrick Knight

//////////////////////
// Global Variables //
//////////////////////

//start

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

//Evaluate the array to place numbers.
const lookNearby = (gameGrid) => {
  let iMin = 0;
  let jMin = 0;
  let iMax = gameGrid.length - 1;
  let jMax = gameGrid[0].length - 1;
  let bombCount = 0;
  for (let i=0; i<=iMax; i++) {
    for (let j=0; j<=jMax; j++) {
      if (gameGrid[i][j] === 'bomb') {
        //Skip
      } else if (i>0 && i<iMax) {
        for (let rowIn=i-1; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGrid[rowIn][colIn] === 'bomb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGrid[i][j] = bombCount;
        bombCount = 0;
      } else if (i == 0) {
        for (let rowIn=i; rowIn<=i+1; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGrid[rowIn][colIn] === 'bomb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGrid[i][j] = bombCount;
        bombCount = 0;
      } else if (i == iMax) {
        for (let rowIn=i-1; rowIn<=i; rowIn++) {
          for (let colIn=j-1; colIn<=j+1; colIn++) {
            if (colIn < 0 || colIn > jMax) {
              //Skip
            } else {
              if(gameGrid[rowIn][colIn] === 'bomb') {
                bombCount+=1;
              }
            }
          }
        }
        gameGrid[i][j] = bombCount;
        bombCount = 0;
      }
    }
  }
  return gameGrid;
}

// Create divs -- test working live, will need to put into a function:
const divMatrix = (gameGrid) => {
  let rowMax = gameGrid.length;
  let colMax = gameGrid[0].length;
  for (let k=0; k<rowMax; k++) {
    let newDivRow = document.createElement('div');
    newDivRow.id = `row${k}`
    newDivRow.classList.add('gameRows')
    for (let x=0; x<colMax; x++) {
      let newSpanCell = document.createElement('span');
      newSpanCell.id = `cell${k}-${x}`;
      newSpanCell.classList.add('gameCell')
      newSpanCell.innerHTML = gameGrid[k][x];
      newDivRow.appendChild(newSpanCell);
    }
    console.log(newDivRow);
    document.querySelector('#gridBody').appendChild(newDivRow);
  }
}


let gameGrid = makeGrid(8, 8);
console.log(gameGrid);
console.log(gameGrid[2].length);
let gameGridMined = lookNearby(populateGrid(gameGrid, 6));
console.log(gameGridMined);
divMatrix(gameGridMined);
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

//////////////////////
// Event Listeners  //
//////////////////////

//start

//////////////////////
// Other Notes      //
//////////////////////

// idea 1: create div's that contain spans, each corresponding to a coordinate in the gameGrid matrix. Each will have a label displaying 'bomb', number nearby, or be blank. These will be covered by a button that can either display a flag (with click turned off), or dissapear on click (checking for game over/iniate recursion).
// idea 2: create cell objects that hold the data for each cell. These 'cells' then get mapped onto divs that get arranged onto a grid.