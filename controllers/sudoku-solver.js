class SudokuSolver {
  validate(puzzle) {
    if (!puzzle) {
      return "Required field missing";
    }
    if (puzzle.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    if (/[^1-9.]/g.test(puzzle)) {
      return "Invalid characters in puzzle";
    }
    return "Valid";
  }

  letterToNumber(row) {
    const mapping = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
    return mapping[row.toUpperCase()] || "none";
  }

  checkRowPlacement(puzzle, row, column, value) {
    let grid = this.stringToBoard(puzzle);
    row = this.letterToNumber(row);
    if (row === "none" || column < 1 || column > 9) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] === value && i + 1 !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzle, row, column, value) {
    let grid = this.stringToBoard(puzzle);
    column = parseInt(column, 10);
    row = this.letterToNumber(row);

    if (row === "none" || column < 1 || column > 9) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] === value && i !== row - 1) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzle, row, col, value) {
    let grid = this.stringToBoard(puzzle);
    row = this.letterToNumber(row);
    col = parseInt(col, 10);
    let startRow = Math.floor((row - 1) / 3) * 3;
    let startCol = Math.floor((col - 1) / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          grid[startRow + i][startCol + j] === value &&
          (startRow + i !== row - 1 || startCol + j !== col - 1)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  stringToBoard(sudokuString) {
    const SIZE = 9;
    if (sudokuString.length !== SIZE * SIZE) {
      throw new Error("Invalid puzzle length");
    }
    const board = [];
    for (let row = 0; row < SIZE; row++) {
      const start = row * SIZE;
      const end = start + SIZE;
      board[row] = sudokuString.substring(start, end).split("");
    }
    return board;
  }

  solveSudoku(board) {
    const SIZE = 9;
    const BOX_SIZE = 3;
    const EMPTY = ".";

    function canPlace(board, row, col, num) {
      for (let X = 0; X < SIZE; X++) {
        if (board[row][X] === num || board[X][col] === num) {
          return false;
        }
      }
      const startRow = row - (row % BOX_SIZE);
      const startCol = col - (col % BOX_SIZE);

      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }
      return true;
    }

    function solve() {
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === EMPTY) {
            for (let num = 1; num <= SIZE; num++) {
              const numStr = num.toString();
              if (canPlace(board, row, col, numStr)) {
                board[row][col] = numStr;
                if (solve()) {
                  return true;
                }
                board[row][col] = EMPTY;
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    return solve() ? board : false;
  }

  completeSudoku(puzzle) {
    if (!puzzle.includes(".")) {
      return puzzle;
    }
    const board = this.stringToBoard(puzzle);
    const solvedBoard = this.solveSudoku(board);
    if (!solvedBoard) return false;
    return solvedBoard.flat().join("");
  }
}

module.exports = SudokuSolver;
