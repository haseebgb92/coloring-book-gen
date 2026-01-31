import type { Word, PuzzleData, WordPlacement } from './types';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const directionMap: Record<Difficulty, WordPlacement['direction'][]> = {
  Easy: ['horizontal', 'vertical'],
  Medium: ['horizontal', 'vertical', 'diagonal-down'],
  Hard: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
};

const offsets = {
  horizontal: { r: 0, c: 1 },
  vertical: { r: 1, c: 0 },
  'diagonal-down': { r: 1, c: 1 },
  'diagonal-up': { r: -1, c: 1 },
};

export function generateWordSearch(words: Word[], gridSize: number, difficulty: Difficulty): PuzzleData | null {
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
  let grid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  let placedWords: WordPlacement[] = [];
  const unplacedWords: string[] = [];

  const availableDirections = directionMap[difficulty];

  for (const word of sortedWords) {
    let placed = false;
    const shuffledDirections = [...availableDirections].sort(() => Math.random() - 0.5);
    const startPositions = Array(gridSize * gridSize).fill(0).map((_, i) => ({ r: Math.floor(i / gridSize), c: i % gridSize })).sort(() => Math.random() - 0.5);

    for (const pos of startPositions) {
        for (const dir of shuffledDirections) {
            const placement: Omit<WordPlacement, 'id'> = { ...word, row: pos.r, col: pos.c, direction: dir };
            if (canPlace(grid, placement)) {
                placeWord(grid, placement);
                placedWords.push({ ...word, ...placement });
                placed = true;
                break;
            }
        }
        if (placed) break;
    }
    if (!placed) {
        unplacedWords.push(word.word);
    }
  }

  const finalGrid = fillEmpty(grid);
  
  return { grid: finalGrid, words: placedWords, unplacedWords };
}

function canPlace(grid: (string | null)[][], placement: Omit<WordPlacement, 'id'>): boolean {
  const { word, row, col, direction } = placement;
  const gridSize = grid.length;
  const offset = offsets[direction];

  for (let i = 0; i < word.length; i++) {
    const r = row + i * offset.r;
    const c = col + i * offset.c;
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
    if (grid[r][c] !== null && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: (string | null)[][], placement: Omit<WordPlacement, 'id'>) {
    const { word, row, col, direction } = placement;
    const offset = offsets[direction];
    for (let i = 0; i < word.length; i++) {
        grid[row + i * offset.r][col + i * offset.c] = word[i];
    }
}

function fillEmpty(grid: (string | null)[][]): string[][] {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return grid.map(row => 
        row.map(cell => cell === null ? alphabet[Math.floor(Math.random() * alphabet.length)] : cell)
    ) as string[][];
}
