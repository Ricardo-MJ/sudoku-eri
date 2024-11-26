// script.js

let solution = [];
let grid = [];

function generateSudoku(difficulty) {
  grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solution = Array.from({ length: 9 }, () => Array(9).fill(0));

  if (!fillGrid(solution)) {
    console.error("Error al generar la solución del Sudoku.");
    return;
  }

  const clues = difficulty === "easy" ? 35 : difficulty === "medium" ? 25 : 17;
  grid = removeNumbers(solution, clues);

  renderSudoku();
}

function fillGrid(grid) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const shuffledNums = nums.sort(() => Math.random() - 0.5);

        for (const num of shuffledNums) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (fillGrid(grid)) {
              return true;
            }

            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidPlacement(grid, row, col, num) {
  // Verifica la fila
  if (grid[row].includes(num)) return false;

  // Verifica la columna
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // Verifica el bloque 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function removeNumbers(grid, clues) {
  const puzzle = grid.map((row) => [...row]);
  let cellsToRemove = 81 - clues;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
}

function renderSudoku() {
  const gridElement = document.getElementById("sudoku-grid");
  gridElement.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "9";
      input.oninput = () => validateInput(input);

      if (grid[row][col] !== 0) {
        input.value = grid[row][col];
        input.disabled = true;
      }

      cell.appendChild(input);
      gridElement.appendChild(cell);
    }
  }
}

function validateInput(input) {
  const value = parseInt(input.value, 10);
  if (isNaN(value) || value < 1 || value > 9) {
    input.value = "";
  }
}

function validateSolution() {
  const inputs = document.querySelectorAll(".cell input");
  let isCorrect = true;

  inputs.forEach((input, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = parseInt(input.value, 10);
    if (value !== solution[row][col]) {
      input.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
      isCorrect = false;
    } else {
      input.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
    }
  });

  alert(isCorrect ? "¡Correcto!" : "Sigue intentando.");
}

function giveHint() {
  const emptyCells = [];
  document.querySelectorAll(".cell input").forEach((input, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    if (input.value === "") emptyCells.push({ row, col });
  });

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    document.querySelectorAll(".cell input")[row * 9 + col].value = solution[row][col];
  } else {
    alert("¡No hay más pistas disponibles!");
  }
}

function setDifficulty(difficulty) {
  generateSudoku(difficulty);
}

function resetGame() {
  generateSudoku("easy");
}

// Inicializar Sudoku en nivel fácil
generateSudoku("easy");