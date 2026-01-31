import type { WordPlacement } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WordsListProps {
  title: string;
  words: WordPlacement[];
  showSolution: boolean;
}

const WordsList = ({ title, words, showSolution }: WordsListProps) => {
  if (!words || words.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-headline font-bold mb-4 text-primary text-center">{title}</h3>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-x-6 gap-y-2 text-center">
          {words.sort((a,b) => a.word.localeCompare(b.word)).map((word) => (
            <p key={word.id} className={cn(
                "text-sm font-medium text-foreground transition-colors inline-block text-left w-full",
                showSolution && "line-through text-muted-foreground"
            )}>
              {word.word}
            </p>
          ))}
      </div>
    </div>
  );
};

export default WordsList;
