"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check if required fields are missing
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    // Validate puzzle
    const validationResult = solver.validate(puzzle);
    if (validationResult !== "Valid") {
      return res.json({ error: validationResult });
    }

    // Validate coordinate
    const row = coordinate.charAt(0).toLowerCase();
    const column = coordinate.charAt(1);
    if (
      coordinate.length !== 2 ||
      !/[a-i]/.test(row) ||
      !/[1-9]/.test(column)
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const index =
      (solver.letterToNumber(row) - 1) * 9 + (parseInt(column, 10) - 1);

    // Check if value already matches
    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    // Check placements
    const validRow = solver.checkRowPlacement(puzzle, row, column, value);
    const validCol = solver.checkColPlacement(puzzle, row, column, value);
    const validReg = solver.checkRegionPlacement(puzzle, row, column, value);
    const conflicts = [];

    if (!validRow) conflicts.push("row");
    if (!validCol) conflicts.push("column");
    if (!validReg) conflicts.push("region");

    // Return all conflicts
    if (conflicts.length === 0) {
      return res.json({ valid: true });
    }

    return res.json({ valid: false, conflict: conflicts }); // Return as array of conflicts
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    // Check if puzzle is provided
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    // Validate puzzle
    const validationResult = solver.validate(puzzle);
    if (validationResult !== "Valid") {
      return res.json({ error: validationResult });
    }

    // Solve the puzzle
    const solution = solver.completeSudoku(puzzle);

    if (!solution || solution.includes(".")) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    return res.json({ solution });
  });
};
