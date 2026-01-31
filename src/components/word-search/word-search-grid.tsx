import type { PuzzleData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WordSearchGridProps {
  grid: PuzzleData['grid'];
  words: PuzzleData['words'];
  showSolution: boolean;
  gridColor: string;
  gridLinesColor: string;
  lettersColor: string;
  solutionColor: string;
}

const WordSearchGrid = ({ grid, words, showSolution, gridColor, gridLinesColor, lettersColor, solutionColor }: WordSearchGridProps) => {
  if (!grid) return null;

  const highlightedCells = new Set<string>();

  if (showSolution) {
    words.forEach(word => {
        const offsets = {
          horizontal: { r: 0, c: 1 },
          vertical: { r: 1, c: 0 },
          'diagonal-down': { r: 1, c: 1 },
          'diagonal-up': { r: -1, c: 1 },
        };
        const offset = offsets[word.direction];
        for (let i = 0; i < word.word.length; i++) {
            const r = word.row + i * offset.r;
            const c = word.col + i * offset.c;
            highlightedCells.add(`${r}-${c}`);
        }
    });
  }

  const gridSize = Math.max(grid.length, grid[0]?.length || 0);

  // Helper to calculate contrast color
  const getContrastColor = (hexcolor: string) => {
    if (!hexcolor) return '#000000';
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const solutionTextColor = getContrastColor(solutionColor);

  return (
    <div
      className="grid p-2 sm:p-4 aspect-square select-none"
      style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
        backgroundColor: gridColor,
      }}
    >
      {grid.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const isHighlighted = highlightedCells.has(`${rIdx}-${cIdx}`);
          
          const cellStyle: React.CSSProperties = {
            borderColor: gridLinesColor,
          };
          
          const letterStyle: React.CSSProperties = {
            color: lettersColor,
            fontSize: `clamp(0.75rem, ${20 / gridSize}vw, 1.5rem)`,
          };

          if (isHighlighted) {
            letterStyle.color = solutionTextColor;
          }

          return (
            <div
              key={`${rIdx}-${cIdx}`}
              className={cn(
                'relative flex items-center justify-center border aspect-square transition-colors duration-300',
                isHighlighted ? 'print:bg-gray-400' : 'print:bg-white'
              )}
              style={{
                  ...cellStyle,
                  backgroundColor: isHighlighted ? solutionColor : 'transparent',
              }}
            >
                <span
                  className={cn(
                    "font-bold uppercase",
                    isHighlighted ? 'print:text-black' : 'print:text-black',
                  )}
                  style={letterStyle}
                >
                  {cell}
                </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default WordSearchGrid;
