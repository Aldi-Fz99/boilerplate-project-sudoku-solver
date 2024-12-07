const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

suite("UnitTests", () => {
  const validPuzzle =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const solvedPuzzle =
    "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

  suite("Validation Tests", () => {
    test("Valid puzzle string of 81 characters", () => {
      assert.equal(solver.validate(validPuzzle), "Valid");
    });

    test("Puzzle string with invalid characters", () => {
      const invalidPuzzle =
        "1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(
        solver.validate(invalidPuzzle),
        "Invalid characters in puzzle"
      );
    });

    test("Puzzle string not 81 characters in length", () => {
      const shortPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92";
      assert.equal(
        solver.validate(shortPuzzle),
        "Expected puzzle to be 81 characters long"
      );
    });
  });

  suite("Placement Tests", () => {
    test("Valid row placement", () => {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, "A", 2, "9"));
    });

    test("Invalid row placement", () => {
      assert.isFalse(solver.checkRowPlacement(validPuzzle, "A", 2, "1"));
    });

    test("Valid column placement", () => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, "A", 2, "8"));
    });

    test("Invalid column placement", () => {
      assert.isFalse(solver.checkColPlacement(validPuzzle, "A", 2, "9"));
    });

    test("Valid region placement", () => {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, "A", 2, "3"));
    });

    test("Invalid region placement", () => {
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, "A", 2, "1"));
    });
  });

  suite("Solver Tests", () => {
    test("Solver handles valid puzzle strings", () => {
      assert.equal(solver.completeSudoku(validPuzzle), solvedPuzzle);
    });

    test("Solver fails for invalid puzzle strings", () => {
      const invalidPuzzle =
        "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.isFalse(solver.completeSudoku(invalidPuzzle));
    });

    test("Solver returns expected solution for incomplete puzzle", () => {
      const incompletePuzzle =
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
      const solvedIncomplete =
        "218396745753284196496157832531672984649831257827549613962415378185763429374928561";
      assert.equal(solver.completeSudoku(incompletePuzzle), solvedIncomplete);
    });
  });
});
