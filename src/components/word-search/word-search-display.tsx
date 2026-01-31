
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Printer, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import WordSearchGrid from './word-search-grid';
import WordsList from './words-list';
import type { PuzzleData } from '@/lib/types';

interface WordSearchDisplayProps {
  puzzleData: PuzzleData | null;
  showSolution: boolean;
  onToggleSolution: () => void;
  onPrint: (options: { printSolution: boolean }) => void;
  onExportImage: (options: { exportSolution: boolean }) => void;
  isLoading: boolean;
  gridColor: string;
  gridLinesColor: string;
  lettersColor: string;
  solutionColor: string;
}

const WordSearchDisplay = ({ 
  puzzleData, 
  showSolution, 
  onToggleSolution, 
  onPrint, 
  onExportImage, 
  isLoading,
  gridColor,
  gridLinesColor,
  lettersColor,
  solutionColor
}: WordSearchDisplayProps) => {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
          <Skeleton className="w-full aspect-square max-w-lg rounded-lg" />
          <div className="w-full max-w-lg space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      );
    }

    if (!puzzleData) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-lg min-h-[400px] p-8">
          <ImageIcon className="h-16 w-16 mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Your puzzle will appear here</h3>
          <p>Add some words and click "Generate Puzzle" to get started.</p>
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-2xl border-4 border-card">
           <WordSearchGrid 
              grid={puzzleData.grid} 
              words={puzzleData.words} 
              showSolution={showSolution} 
              gridColor={gridColor}
              gridLinesColor={gridLinesColor}
              lettersColor={lettersColor}
              solutionColor={solutionColor}
            />
        </div>
        <WordsList title="Words to Find" words={puzzleData.words} showSolution={showSolution} />
      </div>
    );
  };

  return (
    <Card className="shadow-lg no-print">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Word Search</CardTitle>
        {puzzleData && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleSolution}>
              {showSolution ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Printer className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onPrint({ printSolution: false })}>
                  Print Puzzle as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPrint({ printSolution: true })}>
                  Print Solution as PDF
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExportImage({ exportSolution: false })}>
                  Download Puzzle Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportImage({ exportSolution: true })}>
                  Download Solution Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default WordSearchDisplay;
