
'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSession } from 'next-auth/react';
import { generateWordSearch } from '@/lib/word-search-generator';
import type { PuzzleData, Word } from '@/lib/types';
import * as htmlToImage from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Mail, Sparkles as SparklesIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import WordSearchSetup from '@/components/word-search/word-search-setup';
import WordSearchDisplay from '@/components/word-search/word-search-display';
import WordSearchGrid from '@/components/word-search/word-search-grid';
import WordsList from '@/components/word-search/words-list';

const exampleWords: Omit<Word, 'id'>[] = [
  { word: 'REACT' },
  { word: 'NEXTJS' },
  { word: 'TAILWIND' },
  { word: 'TYPESCRIPT' },
  { word: 'SERVER' },
  { word: 'CLIENT' },
  { word: 'HTML' },
  { word: 'CSS' },
  { word: 'NODE' },
  { word: 'API' },
  { word: 'COMPONENT' },
  { word: 'PROPS' },
  { word: 'STATE' },
  { word: 'HOOK' },
  { word: 'ROUTING' },
  { word: 'STYLING' },
  { word: 'FIREBASE' },
  { word: 'GENKIT' },
  { word: 'ZOD' },
  { word: 'SHADCN' }
];

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showPrintableSolution, setShowPrintableSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gridSize, setGridSize] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Color states
  const [gridColor, setGridColor] = useState('#FFFFFF');
  const [gridLinesColor, setGridLinesColor] = useState('#E5E7EB');
  const [lettersColor, setLettersColor] = useState('#111827');
  const [solutionColor, setSolutionColor] = useState('#FBBF24');


  const handleSetWords = (wordString: string) => {
    const newWords = wordString
      .split(',')
      .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
      .filter(w => w.length > 1);

    const uniqueWords = Array.from(new Set(newWords));

    const wordObjects = uniqueWords.map((w, i) => ({ id: Date.now() + i, word: w }));
    setWords(wordObjects);
    if (uniqueWords.length > words.length) {
      toast({ title: 'Words updated', description: `${uniqueWords.length} words are ready for the puzzle.` });
    }
  };

  const handleLoadExample = () => {
    const examplePairs = exampleWords.map((p, i) => ({ ...p, id: Date.now() + i }));
    setWords(examplePairs);
    toast({ title: 'Example loaded', description: 'Example words have been loaded.' });
  };

  const { data: session } = useSession();
  const isPro = (session?.user as any)?.plan === 'pro';
  const [genCount, setGenCount] = useState(0);

  // Initialize count from Server (IP based)
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch('/api/usage/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPro }),
        });
        const data = await res.json();
        // Remaining = 5 - count. So count = 5 - remaining.
        if (data.remaining !== undefined) {
          setGenCount(5 - data.remaining);
        }
      } catch (e) {
        console.error("Failed to fetch usage", e);
      }
    };
    fetchUsage();
  }, [isPro]);


  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      // 1. Check Limits via IP
      const checkRes = await fetch('/api/usage/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPro }),
      });
      const checkData = await checkRes.json();

      if (!checkData.allowed) {
        setShowUpgradeDialog(true);
        setIsLoading(false);
        return;
      }

      if (words.length < 2) {
        toast({ variant: 'destructive', title: 'Not enough words', description: 'Please add at least 2 words to generate a puzzle.' });
        setIsLoading(false);
        return;
      }

      setPuzzleData(null);
      setShowSolution(false);

      // Use a timeout to allow the loading state to render before the blocking generation call
      setTimeout(async () => {
        try {
          const generatedData = generateWordSearch(words, gridSize, difficulty);
          if (!generatedData) {
            throw new Error('Could not generate a valid word search layout. Try different words or a larger grid.');
          }
          setPuzzleData(generatedData);

          // Increment count on server (IP based)
          await fetch('/api/usage/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPro }),
          });

          // Update local state if needed (optional since we check server next time)
          if (!isPro) {
            setGenCount(prev => prev + 1);
          }

          if (generatedData.unplacedWords.length > 0) {
            toast({
              variant: 'destructive',
              title: 'Words not placed',
              description: `Could not place the following words: ${generatedData.unplacedWords.join(', ')}`,
            });
          } else {
            toast({
              title: 'Success!',
              description: isPro ? 'Your puzzle is ready.' : `Generated ${genCount + 1}/5 free puzzles today.`
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          toast({ variant: 'destructive', title: 'Generation Failed', description: errorMessage });
          setPuzzleData(null);
        } finally {
          setIsLoading(false);
        }
      }, 50);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ variant: 'destructive', title: 'Generation Failed', description: errorMessage });
      setIsLoading(false);
    }
  };

  const handlePrint = ({ printSolution }: { printSolution: boolean }) => {
    setShowPrintableSolution(printSolution);
    // Use a short timeout to allow React to re-render the printable content
    // before the print dialog opens.
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleExportImage = async ({ exportSolution }: { exportSolution: boolean }) => {
    const printableElement = document.getElementById('printable-puzzle');
    if (!printableElement) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not find the puzzle element to export.' });
      return;
    }

    // We set the solution state for the printable element specifically for the export.
    setShowPrintableSolution(exportSolution);

    // Temporarily make the element visible for capture
    const originalDisplay = printableElement.style.display;
    printableElement.style.display = 'block';

    try {
      // Use a timeout to ensure the state update has rendered before capturing.
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await htmlToImage.toPng(printableElement, {
        quality: 1.0,
        pixelRatio: 3, // For higher resolution
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `word-search-${exportSolution ? 'solution' : 'puzzle'}.png`;
      link.href = dataUrl;
      link.click();

      toast({ title: 'Image Exported', description: 'Your puzzle image has been downloaded.' });

    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ variant: 'destructive', title: 'Export Failed', description: errorMessage });
    } finally {
      // Restore original styles and reset the printable solution state
      printableElement.style.display = originalDisplay;
      setShowPrintableSolution(false);
    }
  };


  return (
    <>
      <div id="main-content" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start no-print">
        <div className="lg:col-span-1">
          <WordSearchSetup
            words={words}
            onSetWords={handleSetWords}
            onGenerate={handleGenerate}
            onLoadExample={handleLoadExample}
            isLoading={isLoading}
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            gridColor={gridColor}
            onGridColorChange={setGridColor}
            gridLinesColor={gridLinesColor}
            onGridLinesColorChange={setGridLinesColor}
            lettersColor={lettersColor}
            onLettersColorChange={setLettersColor}
            solutionColor={solutionColor}
            onSolutionColorChange={setSolutionColor}
          />

          {!isPro && (
            <Card className="mt-8 border-2 border-indigo-200 bg-indigo-50/30 overflow-hidden shadow-lg">
              <CardHeader className="bg-indigo-100/50 pb-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-lg font-bold text-indigo-900">Upgrade to PRO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="text-sm font-bold text-indigo-900">Daily Free Puzzles:</span>
                  <Badge variant={genCount >= 5 ? "destructive" : "secondary"} className="text-sm font-mono px-3 bg-indigo-50 text-indigo-700">
                    {genCount} / 5
                  </Badge>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-indigo-800 uppercase tracking-tight flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> PRO BENEFITS:
                  </p>
                  <ul className="grid grid-cols-1 gap-2">
                    {[
                      'UNLIMITED generation',
                      'Full Multi-Level Studio',
                      'KDP Print-Ready PDFs',
                      'High Res 300 DPI Export',
                      'Flatten PDF for font safety',
                      'Downloadable CSV Templates',
                      'Premium Indigo Badge',
                      'PRO Monthly Access for $99'
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-indigo-900/80 font-medium font-sans">
                        <CheckCircle2 className="h-3 w-3 text-indigo-600 mt-0.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-indigo-100 space-y-3">
                  <p className="text-xs text-indigo-800 mb-2 text-center font-bold">
                    Price: $99 / Month
                  </p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 font-bold shadow-md" asChild>
                    <a href="https://wa.me/923059051007?text=I%20want%20to%20upgrade%20to%20the%20PRO%20STUDIO" target="_blank">
                      Upgrade via WhatsApp
                    </a>
                  </Button>
                  <p className="text-[10px] text-center text-slate-400">
                    Email: wordsearchstudio@advertpreneur.com
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <WordSearchDisplay
            puzzleData={puzzleData}
            showSolution={showSolution}
            onToggleSolution={() => setShowSolution(s => !s)}
            onPrint={handlePrint}
            onExportImage={handleExportImage}
            isLoading={isLoading}
            gridColor={gridColor}
            gridLinesColor={gridLinesColor}
            lettersColor={lettersColor}
            solutionColor={solutionColor}
          />
        </div>
      </div>

      {/* This is a hidden element that will only be visible when printing or exporting */}
      <div id="printable-puzzle" className="hidden print-only bg-white">
        {puzzleData && (
          <div className="p-8 w-full max-w-2xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-center mb-4">Word Search</h1>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden border-4 border-black">
                <WordSearchGrid
                  grid={puzzleData.grid}
                  words={puzzleData.words}
                  showSolution={showPrintableSolution}
                  gridColor={gridColor}
                  gridLinesColor={gridLinesColor}
                  lettersColor={lettersColor}
                  solutionColor={solutionColor}
                />
              </div>
              <WordsList title="Words to Find" words={puzzleData.words} showSolution={showPrintableSolution} />
            </div>
          </div>
        )}
      </div>

      {/* Pro Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-indigo-600 p-8 text-center text-white space-y-4">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md animate-pulse">
              <SparklesIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Daily Limit Reached</h2>
            <p className="text-indigo-100 font-medium">You've reached the 5 free puzzles/day limit.</p>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Unlimited Puzzles', desc: 'Generate as many as you need.' },
                { title: 'KDP Print Ready', desc: 'Perfect margins, bleed & trim.' },
                { title: '300 DPI Export', desc: 'Crystal clear professional printing.' },
                { title: 'Full Book Studio', desc: 'Multi-level builders and more.' },
                { title: 'PDF Flattening', desc: 'Prevents font errors in KDP.' },
                { title: 'Custom Branding', desc: 'Use your own fonts and assets.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 bg-indigo-50 p-1.5 rounded-full h-fit">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 font-sans">PRO Monthly Subscription</p>
                <div className="text-4xl font-black text-indigo-600">$99<span className="text-sm text-slate-400 ml-1">/month</span></div>
              </div>
              <Button className="w-full md:w-auto h-12 px-8 font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" asChild>
                <a href="https://wa.me/923059051007?text=I%20have%20reached%20my%20daily%20limit%20and%20want%20to%20upgrade%20to%20PRO" target="_blank">
                  UPGRADE TO PRO
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
