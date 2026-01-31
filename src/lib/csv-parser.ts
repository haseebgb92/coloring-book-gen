import Papa from 'papaparse';
import type { Word } from './types';

export interface WordListByDifficulty {
  easy: Word[];
  medium: Word[];
  hard: Word[];
  easyTitle: string;
  mediumTitle: string;
  hardTitle: string;
}

export interface SingleLevelWordList {
  words: Word[];
  title: string;
}

export interface PuzzleSet {
  title: string;
  description?: string;
  words: Word[];
}

// Parse a single difficulty level CSV (Title, Word format) - can contain multiple puzzles
export function parseSingleLevelCSV(csvText: string, maxWords: number): PuzzleSet[] {
  const puzzles: PuzzleSet[] = [];

  try {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });

    if (parsed.errors.length > 0) {
      throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
    }

    const data = parsed.data as Record<string, string>[];

    let globalIdCounter = 1;

    data.forEach((row) => {
      const title = row.title?.trim() || '';
      const description = row.description?.trim() || undefined;
      const wordColumn = row.word || row.words || '';

      // Skip rows without both title and words
      if (!title && !wordColumn.trim()) {
        return;
      }

      // If there's a title, start a new puzzle
      if (title) {
        // Parse words from the word column (can be comma-separated)
        const words: Word[] = [];
        const wordStrings = wordColumn.split(',').map(w => w.trim()).filter(w => w.length > 0);

        wordStrings.forEach(wordStr => {
          const word = wordStr.toUpperCase().replace(/[^A-Z]/g, '');
          if (word.length > 1 && words.length < maxWords) {
            words.push({ id: globalIdCounter++, word });
          }
        });

        if (words.length > 0) {
          puzzles.push({ title, description, words });
        }
      } else if (puzzles.length > 0) {
        // If no title but there are words, add them to the last puzzle
        const lastPuzzle = puzzles[puzzles.length - 1];
        const wordStrings = wordColumn.split(',').map(w => w.trim()).filter(w => w.length > 0);

        wordStrings.forEach(wordStr => {
          const word = wordStr.toUpperCase().replace(/[^A-Z]/g, '');
          if (word.length > 1 && lastPuzzle.words.length < maxWords) {
            lastPuzzle.words.push({ id: globalIdCounter++, word });
          }
        });
      }
    });

    // If no puzzles found but there's data, create a default puzzle
    if (puzzles.length === 0 && data.length > 0) {
      const words: Word[] = [];
      let idCounter = 1;
      data.forEach((row) => {
        const wordColumn = row.word || row.words || '';
        const wordStrings = wordColumn.split(',').map(w => w.trim()).filter(w => w.length > 0);
        wordStrings.forEach(wordStr => {
          const word = wordStr.toUpperCase().replace(/[^A-Z]/g, '');
          if (word.length > 1 && words.length < maxWords) {
            words.push({ id: idCounter++, word });
          }
        });
      });
      if (words.length > 0) {
        puzzles.push({ title: 'Word Search', words });
      }
    }

    return puzzles;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Legacy function for backward compatibility (kept for now but can be removed)
export function parseCSV(csvText: string): WordListByDifficulty {
  const result: WordListByDifficulty = {
    easy: [],
    medium: [],
    hard: [],
    easyTitle: '',
    mediumTitle: '',
    hardTitle: ''
  };

  try {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });

    if (parsed.errors.length > 0) {
      throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
    }

    const data = parsed.data as Record<string, string>[];

    let idCounter = 1;
    let easyTitleFound = false;
    let mediumTitleFound = false;
    let hardTitleFound = false;

    data.forEach((row, index) => {
      // Extract titles from first row that has title values
      if (!easyTitleFound && row.easytitle && row.easytitle.trim()) {
        result.easyTitle = row.easytitle.trim();
        easyTitleFound = true;
      }
      if (!mediumTitleFound && row.mediumtitle && row.mediumtitle.trim()) {
        result.mediumTitle = row.mediumtitle.trim();
        mediumTitleFound = true;
      }
      if (!hardTitleFound && row.hardtitle && row.hardtitle.trim()) {
        result.hardTitle = row.hardtitle.trim();
        hardTitleFound = true;
      }

      // Process Easy column (limit to 10 words)
      if (row.easy && row.easy.trim() && result.easy.length < 10) {
        const word = row.easy.trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length > 1) {
          result.easy.push({ id: idCounter++, word });
        }
      }

      // Process Medium column (limit to 13 words)
      if (row.medium && row.medium.trim() && result.medium.length < 13) {
        const word = row.medium.trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length > 1) {
          result.medium.push({ id: idCounter++, word });
        }
      }

      // Process Hard column (limit to 15 words)
      if (row.hard && row.hard.trim() && result.hard.length < 15) {
        const word = row.hard.trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length > 1) {
          result.hard.push({ id: idCounter++, word });
        }
      }
    });

    // If no title found, use default
    if (!result.easyTitle) result.easyTitle = 'Easy Word Search';
    if (!result.mediumTitle) result.mediumTitle = 'Medium Word Search';
    if (!result.hardTitle) result.hardTitle = 'Hard Word Search';

    return result;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function downloadCSVTemplate() {
  const csvContent = `Title,Description,Word
Animals,Find the animals hidden in the grid,CAT
,,DOG
,,BIRD
,,FISH
Fruit,Find the delicious fruits,APPLE
,,BANANA
,,CHERRY
,,ORANGE`;
  const filename = 'word-search-puzzles-template.csv';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

