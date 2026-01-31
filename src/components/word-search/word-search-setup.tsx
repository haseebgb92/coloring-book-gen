
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Wand2, Palette } from 'lucide-react';
import type { Word } from '@/lib/types';
import { Input } from '../ui/input';

const formSchema = z.object({
  words: z.string().min(2, { message: 'Please enter at least one word.' }),
});

type FormValues = z.infer<typeof formSchema>;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface WordSearchSetupProps {
  words: Word[];
  onSetWords: (words: string) => void;
  onGenerate: () => void;
  onLoadExample: () => void;
  isLoading: boolean;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  gridColor: string;
  onGridColorChange: (color: string) => void;
  gridLinesColor: string;
  onGridLinesColorChange: (color: string) => void;
  lettersColor: string;
  onLettersColorChange: (color: string) => void;
  solutionColor: string;
  onSolutionColorChange: (color: string) => void;
}

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) => (
    <div className="flex items-center justify-between">
        <FormLabel>{label}</FormLabel>
        <div className="flex items-center gap-2 border rounded-md pl-3">
            <Input 
                type="color" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 m-0 border-0 bg-transparent"
            />
            <span 
                className="font-mono text-sm pr-3 cursor-pointer"
                onClick={() => {
                    const textInput = document.createElement('input');
                    textInput.value = value;
                    document.body.appendChild(textInput);
                    textInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(textInput);
                }}
            >
                {value}
            </span>
        </div>
    </div>
);


const WordSearchSetup = ({ 
    words, onSetWords, onGenerate, onLoadExample, isLoading, 
    gridSize, onGridSizeChange, difficulty, onDifficultyChange,
    gridColor, onGridColorChange, gridLinesColor, onGridLinesColorChange,
    lettersColor, onLettersColorChange, solutionColor, onSolutionColorChange,
}: WordSearchSetupProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { words: '' },
  });

  useEffect(() => {
    // When the external words array changes (e.g. by loading an example),
    // update the form field to reflect it.
    form.setValue('words', words.map(w => w.word).join(', '));
  }, [words, form]);

  // Use onBlur to update the parent state as the user types
  const handleBlur = () => {
    const wordString = form.getValues('words');
    onSetWords(wordString);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            Create Your Puzzle
        </CardTitle>
        <CardDescription>Add words and set the options for your word search.</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Words</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. React, NextJS, Tailwind"
                      className="min-h-[120px] resize-y"
                      {...field}
                      onBlur={handleBlur} // Update on blur
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a list of words separated by commas. Any numbers or special characters will be automatically removed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
                <FormLabel>Difficulty</FormLabel>
                 <RadioGroup
                    value={difficulty}
                    onValueChange={(value: Difficulty) => onDifficultyChange(value)}
                    className="flex space-x-1 rounded-lg bg-muted p-1"
                >
                    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                    <FormItem key={level} className="flex-1">
                        <FormControl>
                        <RadioGroupItem value={level} className="sr-only" id={`difficulty-${level}`} />
                        </FormControl>
                        <FormLabel
                        htmlFor={`difficulty-${level}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary w-full text-center"
                        >
                        {level}
                        </FormLabel>
                    </FormItem>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <FormLabel>Grid Size: {gridSize}x{gridSize}</FormLabel>
                </div>
                <Slider
                    value={[gridSize]}
                    onValueChange={(value) => onGridSizeChange(value[0])}
                    min={10}
                    max={25}
                    step={1}
                />
            </div>
             <Separator />
            <div className="space-y-4">
                <FormLabel className="flex items-center gap-2 text-base"><Palette /> Appearance</FormLabel>
                <ColorInput label="Grid Background" value={gridColor} onChange={onGridColorChange} />
                <ColorInput label="Grid Lines" value={gridLinesColor} onChange={onGridLinesColorChange} />
                <ColorInput label="Letter Color" value={lettersColor} onChange={onLettersColorChange} />
                <ColorInput label="Solution Color" value={solutionColor} onChange={onSolutionColorChange} />
            </div>

            <div className="relative">
                <Separator className="my-6" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card text-card-foreground px-2 text-xs">OR</span>
            </div>
            
            <Button type="button" variant="secondary" onClick={onLoadExample} className="w-full">
              Load Example
            </Button>
          </CardContent>
        </form>
      </Form>
      
      <CardFooter className="p-6 border-t">
        <Button onClick={onGenerate} disabled={isLoading || words.length < 1} className="w-full text-lg py-6">
          {isLoading ? (
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate Puzzle'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WordSearchSetup;
