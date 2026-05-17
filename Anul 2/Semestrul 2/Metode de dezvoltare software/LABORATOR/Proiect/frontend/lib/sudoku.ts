type Grid = number[][];

const shuffle = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const isValid = (grid: Grid, row: number, col: number, num: number) => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

const fillGrid = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(nums);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Count solutions to check for uniqueness
const countSolutions = (grid: Grid, count = 0): number => {
  let row = -1;
  let col = -1;
  let isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  if (!isEmpty) return count + 1;

  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      count = countSolutions(grid, count);
      grid[row][col] = 0; // backtrack
      if (count > 1) return count; // Stop early if >1 solution
    }
  }
  return count;
};

export const generateSudoku = () => {
  // Generate complete valid board
  const solution: Grid = Array(9).fill(null).map(() => Array(9).fill(0));
  fillGrid(solution);

  // Copy to create puzzle
  const puzzle: Grid = solution.map(row => [...row]);

  // Dig holes (remove numbers) to create puzzle
  let attempts = 45; 
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;

      // Check for uniqueness
      const gridCopy = puzzle.map(r => [...r]);
      const numSolutions = countSolutions(gridCopy);

      if (numSolutions !== 1) {
        // If not unique, put it back and try another
        puzzle[row][col] = backup;
      }
      attempts--;
    }
  }

  return { puzzle, solution };
};
