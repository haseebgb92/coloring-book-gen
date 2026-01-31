'use client';

import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '@/hooks/use-toast';
import { generateWordSearch } from '@/lib/word-search-generator';
import { parseSingleLevelCSV, downloadCSVTemplate, type PuzzleSet } from '@/lib/csv-parser';
import { generateMultiLevelPDF, generatePreviewImage, type PageFormat, type PageOrientation, type LayoutMode, DEFAULT_PAGE_SPEC, type FrontMatterPage } from '@/lib/pdf-generator';
import type { PuzzleData, Word, Template } from '@/lib/types';
import { DEFAULT_TEMPLATES } from '@/lib/templates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSession, signIn, signOut } from "next-auth/react";
import { Download, Upload, FileText, Image as ImageIcon, Loader2, Settings2, Palette, Type, LayoutTemplate, Plus, Trash2, Printer, CheckCircle2, Info, Eye, Sparkles, RefreshCw, BookOpen, Layers, Lock, LogOut, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import WordSearchGrid from './word-search-grid';
import WordsList from './words-list';
import { fetchGoogleFont, POPULAR_FONTS } from '@/lib/font-utils';

const INCH_TO_MM = 25.4;
const TRIM_SIZES = {
  '8.5x11': { width: 8.5 * INCH_TO_MM, height: 11 * INCH_TO_MM },
  '8x10': { width: 8 * INCH_TO_MM, height: 10 * INCH_TO_MM },
  '8x5': { width: 8 * INCH_TO_MM, height: 5 * INCH_TO_MM },
};
const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  a5: { width: 148, height: 210 },
  b5: { width: 176, height: 250 },
};

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface GeneratedPuzzle {
  puzzle: PuzzleData;
  difficulty: Difficulty;
  title: string;
  description?: string;
}

const DUMMY_PUZZLE: PuzzleData = {
  grid: [
    ['S', 'A', 'M', 'P', 'L', 'E', 'G', 'R', 'I', 'D'],
    ['P', 'R', 'E', 'V', 'I', 'E', 'W', 'H', 'E', 'R'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'E'],
    ['T', 'E', 'M', 'P', 'L', 'A', 'T', 'E', 'J', 'K'],
    ['L', 'A', 'Y', 'O', 'U', 'T', 'K', 'L', 'M', 'N'],
    ['G', 'E', 'N', 'E', 'R', 'A', 'T', 'O', 'R', 'O'],
    ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'],
    ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
    ['T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C']
  ],
  words: [
    { id: 1, word: 'SAMPLE', row: 0, col: 0, direction: 'horizontal' },
    { id: 2, word: 'PREVIEW', row: 1, col: 0, direction: 'horizontal' },
    { id: 3, word: 'TEMPLATE', row: 3, col: 0, direction: 'horizontal' },
    { id: 4, word: 'LAYOUT', row: 4, col: 0, direction: 'horizontal' },
    { id: 5, word: 'GENERATOR', row: 5, col: 0, direction: 'horizontal' },
  ],
  unplacedWords: []
};

const initialGridData: PuzzleData = {
  grid: [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
  words: [],
  unplacedWords: []
};

const StyleControl = ({ label, sizeValue, onSizeChange, colorValue, onColorChange, min = 6, max = 72 }: any) => (
  <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-gray-950 border border-border/50 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900 group">
    <div className="flex items-center justify-between mb-1">
      <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider group-hover:text-indigo-600 transition-colors">{label}</Label>
    </div>
    <div className="grid grid-cols-12 gap-5 items-center">
      <div className="col-span-8 space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-foreground/70">
          <span className="opacity-50">Size</span>
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md">{sizeValue}pt</span>
        </div>
        <Slider
          value={[sizeValue]}
          min={min}
          max={max}
          step={1}
          onValueChange={([v]) => onSizeChange(v)}
          className="py-2"
        />
      </div>
      <div className="col-span-4 space-y-2">
        <span className="text-[10px] font-bold text-foreground/70 opacity-50 block text-center">Color</span>
        <div className="flex gap-2 h-9 items-center justify-center">
          <div className="relative h-9 w-9 rounded-lg border-2 border-white dark:border-gray-800 overflow-hidden shadow-md ring-1 ring-black/5 hover:scale-110 transition-transform cursor-pointer">
            <input
              type="color"
              value={colorValue}
              onChange={e => onColorChange(e.target.value)}
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function MultiLevelGenerator() {
  const { data: session, status } = useSession();
  const isPro = (session?.user as any)?.plan === 'pro';
  const isAdmin = (session?.user as any)?.role === 'admin';
  const [showProPrompt, setShowProPrompt] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !isPro) {
      setShowProPrompt(true);
    }
  }, [status, isPro]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [generationMode, setGenerationMode] = useState<'single' | 'multi'>('single');
  const [puzzles, setPuzzles] = useState<PuzzleSet[]>([]);
  const [easyPuzzles, setEasyPuzzles] = useState<PuzzleSet[]>([]);
  const [mediumPuzzles, setMediumPuzzles] = useState<PuzzleSet[]>([]);
  const [hardPuzzles, setHardPuzzles] = useState<PuzzleSet[]>([]);

  const [backgroundImages, setBackgroundImages] = useState<{
    odd: string | null;
    even: string | null;
  }>({
    odd: null,
    even: null,
  });

  const [multiBackgrounds, setMultiBackgrounds] = useState<{
    easy: { odd: string | null; even: string | null };
    medium: { odd: string | null; even: string | null };
    hard: { odd: string | null; even: string | null };
  }>({
    easy: { odd: null, even: null },
    medium: { odd: null, even: null },
    hard: { odd: null, even: null },
  });
  const [gridSizes, setGridSizes] = useState({
    easy: 15,
    medium: 18,
    hard: 20
  });
  const [generatedPuzzles, setGeneratedPuzzles] = useState<GeneratedPuzzle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [gridSize, setGridSize] = useState(15);
  const [solutionColor, setSolutionColor] = useState('#D1D1D1');
  const [titleColor, setTitleColor] = useState('#000000');

  const [fontSizes, setFontSizes] = useState({
    title: 32,
    description: 14,
    gridLetters: 16,
    wordListHeading: 22,
    wordListItems: 16,
    solutionTitle: 12,
  });
  const [fontColors, setFontColors] = useState<{
    title: string;
    description: string;
    gridLetters: string;
    wordListHeading: string;
    wordListItems: string;
    contentBoxOutline?: string;
  }>({
    title: '#000000',
    description: '#555555',
    gridLetters: '#000000',
    wordListHeading: '#000000',
    wordListItems: '#333333',
    contentBoxOutline: '#3C3C3C',
  });
  const [pageFormat, setPageFormat] = useState<PageFormat>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('words-on-top');

  const [enableKDPMode, setEnableKDPMode] = useState(false);
  const [printType, setPrintType] = useState<'paperback' | 'hardcover'>('paperback');
  const [trimSize, setTrimSize] = useState<'8.5x11' | '8x10' | '8x5'>('8.5x11');
  const [pdfTitle, setPdfTitle] = useState('Word Search Puzzles');
  const [pdfAuthor, setPdfAuthor] = useState('');
  const [previewPageType, setPreviewPageType] = useState<'odd' | 'even'>('odd');
  const [frontMatterPdf, setFrontMatterPdf] = useState<File | null>(null);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [startPageNumber, setStartPageNumber] = useState(1);
  const [customFont, setCustomFont] = useState<{
    name: string;
    data: string;
    boldData?: string;
  } | null>(null);
  const [flattenPdf, setFlattenPdf] = useState(false);
  const [highQualityPrint, setHighQualityPrint] = useState(true);
  const [seamlessPattern, setSeamlessPattern] = useState<'none' | 'dots' | 'grid' | 'waves' | 'diagonal' | 'icons' | 'stars' | 'circles' | 'confetti' | 'honeycomb' | 'diamonds' | 'crosses' | 'triangles' | 'chevron' | 'islamic' | 'leaves' | 'flowers' | 'modern-abstract' | 'polka-dots' | 'dashed-grid'>('none');
  const [seamlessPatternOpacity, setSeamlessPatternOpacity] = useState(0.12);

  const [contentBoxBorderWidth, setContentBoxBorderWidth] = useState(0.5);
  const [contentBoxBorderRadius, setContentBoxBorderRadius] = useState(0);
  const [pageNumberStyle, setPageNumberStyle] = useState<'simple' | 'circle' | 'accent-bar' | 'brackets' | 'roman' | 'roman-caps' | 'elegant-dash' | 'modern-box' | 'capsule' | 'pill'>('simple');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-outer' | 'top-center' | 'top-outer'>('bottom-center');
  const [pageNumberFillColor, setPageNumberFillColor] = useState('#000000');
  const [pageNumberTextColor, setPageNumberTextColor] = useState('#FFFFFF');

  const [sectionFonts, setSectionFonts] = useState<{
    title?: { name: string; data: string };
    description?: { name: string; data: string };
    grid?: { name: string; data: string };
    wordList?: { name: string; data: string };
  }>({});

  const [frontMatter, setFrontMatter] = useState<FrontMatterPage[]>([]);
  const [backMatter, setBackMatter] = useState<FrontMatterPage[]>([]);
  const [bookLogo, setBookLogo] = useState<string | null>(null);
  const [showFrontMatterDialog, setShowFrontMatterDialog] = useState(false);
  const [editingFMIndex, setEditingFMIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'front' | 'back'>('front');
  const [fmForm, setFMForm] = useState<FrontMatterPage>({
    title: '',
    subtitle: '',
    content: '',
    type: 'standard',
    alignment: 'center'
  });
  const [previewPageSource, setPreviewPageSource] = useState<'puzzle' | 'front-matter' | 'back-matter'>('puzzle');
  const [selectedFMPreviewIndex, setSelectedFMPreviewIndex] = useState(0);

  const { toast } = useToast();

  const handleTemplateChange = async (templateId: string) => {
    // Restriction for Template 21
    if (templateId === 'retro-words-premium' && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Template 21 is reserved for administrators only."
      });
      return;
    }

    setSelectedTemplateId(templateId);
    setPreviewImage(null);
    const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setLayoutMode(template.layout);
      setPageNumberStyle(template.pageNumber.style as any);
      setPageNumberPosition(template.pageNumber.position as any);
      setPageNumberFillColor(template.pageNumber.fillColor || '#000000');
      setPageNumberTextColor(template.pageNumber.textStyle.color || '#FFFFFF');
      setContentBoxBorderRadius(template.contentBox.border.radius);
      setContentBoxBorderWidth(template.contentBox.border.width);
      setTitleColor(template.typography.title.color);
      setFontSizes({
        title: template.typography.title.fontSize,
        description: template.typography.description.fontSize,
        gridLetters: template.typography.gridLetters.fontSize,
        wordListHeading: template.typography.wordListHeading.fontSize,
        wordListItems: template.typography.wordListItems.fontSize,
        solutionTitle: template.typography.wordListItems.fontSize - 4,
      });
      setFontColors({
        title: template.typography.title.color,
        description: template.typography.description.color,
        gridLetters: template.typography.gridLetters.color,
        wordListHeading: template.typography.wordListHeading.color,
        wordListItems: template.typography.wordListItems.color,
        contentBoxOutline: template.contentBox.border.color || '#3C3C3C',
      });

      setIsPreviewLoading(true);
      try {
        const fontsToLoad: any = {};
        const sections = [
          { key: 'title', family: template.typography.title.fontFamily },
          { key: 'description', family: template.typography.description.fontFamily },
          { key: 'grid', family: template.typography.gridLetters.fontFamily },
          { key: 'wordList', family: template.typography.wordListItems.fontFamily },
        ];

        for (const s of sections) {
          if (s.family && s.family !== 'helvetica' && s.family !== 'times' && s.family !== 'courier') {
            try {
              const data = await fetchGoogleFont(s.family);
              fontsToLoad[s.key] = { name: s.family, data };
            } catch (e) {
              console.warn(`Could not load font ${s.family} for ${s.key}, using default.`);
            }
          }
        }
        setSectionFonts(fontsToLoad);

        handleGeneratePreview(template, fontsToLoad);

      } catch (error) {
        console.error("Font auto-loading failed:", error);
      } finally {
        setIsPreviewLoading(false);
      }

      toast({
        title: "Template Applied",
        description: `Applied ${template.name} styles.`
      });
    }
  };


  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const easyCsvFileInputRef = useRef<HTMLInputElement>(null);
  const mediumCsvFileInputRef = useRef<HTMLInputElement>(null);
  const hardCsvFileInputRef = useRef<HTMLInputElement>(null);
  const oddImageInputRef = useRef<HTMLInputElement>(null);
  const evenImageInputRef = useRef<HTMLInputElement>(null);
  const frontMatterInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const fontBoldInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = (mode: 'single' | 'easy' | 'medium' | 'hard') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let csvText = e.target?.result as string;

        if (csvText.includes('\0')) {
          csvText = csvText.replace(/\0/g, '');
        }

        const maxWords = mode === 'easy' ? 10 : mode === 'medium' ? 13 : mode === 'hard' ? 15 : 25;
        const parsed = parseSingleLevelCSV(csvText, maxWords);

        if (mode === 'single') setPuzzles(parsed);
        else if (mode === 'easy') setEasyPuzzles(parsed);
        else if (mode === 'medium') setMediumPuzzles(parsed);
        else if (mode === 'hard') setHardPuzzles(parsed);

        const totalWords = parsed.reduce((sum, p) => sum + p.words.length, 0);
        toast({
          title: `CSV Loaded`,
          description: `Loaded ${parsed.length} puzzles for ${mode.toUpperCase()}.`,
        });
      } catch (error) {
        console.error('CSV Processing Error:', error);
        toast({
          variant: 'destructive',
          title: 'CSV Parse Error',
          description: error instanceof Error ? error.message : 'Failed to parse CSV file',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (side: 'odd' | 'even', level?: Difficulty) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (!level) {
        setBackgroundImages(prev => ({ ...prev, [side]: reader.result as string }));
      } else {
        const key = level.toLowerCase() as keyof typeof multiBackgrounds;
        setMultiBackgrounds(prev => ({
          ...prev,
          [key]: { ...prev[key], [side]: reader.result as string }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFontUpload = (isBold: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ttf')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Font Format',
        description: 'Please upload a .ttf (TrueType) font file. Other formats like .otf are not supported by the generator.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      if (isBold) {
        setCustomFont(prev => ({
          name: prev?.name || file.name.replace('-Bold', '').replace('.ttf', ''),
          data: prev?.data || '',
          boldData: base64
        }));
      } else {
        setCustomFont(prev => ({
          name: file.name.replace('.ttf', ''),
          data: base64,
          boldData: prev?.boldData
        }));
      }
      toast({
        title: `Font Loaded: ${file.name}`,
        description: `Successfully loaded ${isBold ? 'Bold' : 'Regular'} font variant.`
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAll = async () => {
    const isMulti = generationMode === 'multi';
    const sourceArr = isMulti ? [
      { list: easyPuzzles, diff: 'Easy' as Difficulty, size: gridSizes.easy },
      { list: mediumPuzzles, diff: 'Medium' as Difficulty, size: gridSizes.medium },
      { list: hardPuzzles, diff: 'Hard' as Difficulty, size: gridSizes.hard }
    ] : [
      { list: puzzles, diff: 'Medium' as Difficulty, size: gridSize }
    ];

    const hasAny = sourceArr.some(s => s.list.length > 0);

    if (!hasAny) {
      toast({
        variant: 'destructive',
        title: 'Missing Word Lists',
        description: isMulti ? 'Please upload at least one CSV for Easy, Medium, or Hard.' : 'Please upload a CSV file first.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPuzzles([]);

    try {
      const allPuzzles: GeneratedPuzzle[] = [];

      for (const group of sourceArr) {
        for (const puzzleSet of group.list) {
          const words = puzzleSet.words;

          if (words.length < 2) {
            toast({
              variant: 'default',
              title: `Skipping puzzle "${puzzleSet.title}"`,
              description: `Not enough words (${words.length}). Need at least 2 words.`,
            });
            continue;
          }

          // Limit for free users (10 pages total)
          if (!isPro && allPuzzles.length >= 10) {
            toast({
              variant: 'default',
              title: "Free Version Limit",
              description: "Free users are limited to 10 puzzles in Multi-Level Studio. Upgrade to Pro for unlimited!",
            });
            break;
          }

          const puzzle = generateWordSearch(words, group.size, group.diff);
          if (!puzzle) {
            toast({
              variant: 'default',
              title: `Puzzle "${puzzleSet.title}" generation failed`,
              description: 'Could not generate a valid puzzle. Try adjusting grid size or words.',
            });
            continue;
          }

          allPuzzles.push({
            puzzle,
            difficulty: group.diff,
            title: puzzleSet.title,
            description: puzzleSet.description,
          });
        }
      }

      if (allPuzzles.length > 0) {
        setGeneratedPuzzles(allPuzzles);
        toast({
          title: 'Success!',
          description: `Generated ${allPuzzles.length} puzzles successfully.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'No puzzles could be generated. Please check your word list.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (generatedPuzzles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Puzzles Not Ready',
        description: 'Please generate puzzles first.',
      });
      return;
    }

    setIsExporting(true);
    try {
      let frontMatterPageCount = 0;
      let frontPdfDoc: PDFDocument | null = null;

      if (frontMatterPdf) {
        frontPdfDoc = await PDFDocument.load(await frontMatterPdf.arrayBuffer());
        frontMatterPageCount = frontPdfDoc.getPageCount();
      }

      const pdfBytes = await generateMultiLevelPDF(
        generatedPuzzles.map((p: any) => {
          const isMulti = generationMode === 'multi';
          const levelKey = p.difficulty.toLowerCase() as keyof typeof multiBackgrounds;
          return {
            puzzle: p.puzzle,
            difficulty: p.difficulty,
            title: p.title,
            description: p.description,
            oddBackground: isMulti ? (multiBackgrounds[levelKey].odd || undefined) : (backgroundImages.odd || undefined),
            evenBackground: isMulti ? (multiBackgrounds[levelKey].even || undefined) : (backgroundImages.even || undefined),
          };
        }),
        undefined,
        {
          template: (() => {
            const baseTemplate = DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];
            return {
              ...baseTemplate,
              contentBox: {
                ...baseTemplate.contentBox,
                fillColor: baseTemplate.contentBox.fillColor || '#FFFFFF',
                border: {
                  ...baseTemplate.contentBox.border,
                  width: contentBoxBorderWidth,
                  radius: contentBoxBorderRadius,
                }
              },
              pageNumber: {
                ...baseTemplate.pageNumber,
                style: pageNumberStyle,
                position: pageNumberPosition,
                fillColor: pageNumberFillColor,
                textStyle: {
                  ...baseTemplate.pageNumber.textStyle,
                  color: pageNumberTextColor,
                }
              }
            };
          })(),
          solutionColor,
          titleColor,
          fontSizes,
          fontColors,
          pageFormat,
          orientation,
          layoutMode,
          enableBleed: enableKDPMode,
          printType: enableKDPMode ? printType : undefined,
          trimSize: enableKDPMode ? trimSize : undefined,
          pdfTitle,
          pdfAuthor,
          showPageNumbers,
          startPageNumber: startPageNumber,
          frontMatterPageCount: frontMatterPageCount,
          customFont: customFont || undefined,
          sectionFonts: sectionFonts,
          flattenPdf: isPro && flattenPdf,
          highQualityPrint: isPro && highQualityPrint,
          seamlessPattern: seamlessPattern,
          seamlessPatternOpacity: seamlessPatternOpacity,
          isMultiLevel: generationMode === 'multi',
          frontMatter: frontMatter,
          backMatter: backMatter,
          bookLogo: bookLogo || undefined,
        }
      );

      let finalPdfBytes: any = pdfBytes;

      if (frontPdfDoc) {
        const mainPdfDoc = await PDFDocument.load(pdfBytes);
        const combinedPdf = await PDFDocument.create();

        const MM_TO_POINTS = 72 / 25.4;

        let trimW = 8.5 * INCH_TO_MM;
        let trimH = 11 * INCH_TO_MM;

        if (enableKDPMode) {
          if (trimSize === '8.5x11') { trimW = 8.5 * INCH_TO_MM; trimH = 11 * INCH_TO_MM; }
          else if (trimSize === '8x10') { trimW = 8.0 * INCH_TO_MM; trimH = 10 * INCH_TO_MM; }
          else if (trimSize === '8x5') { trimW = 8.0 * INCH_TO_MM; trimH = 5 * INCH_TO_MM; }
        } else {
          const formats: Record<string, { w: number, h: number }> = {
            a4: { w: 210, h: 297 },
            letter: { w: 215.9, h: 279.4 },
            a5: { w: 148, h: 210 },
            b5: { w: 176, h: 250 }
          };
          const f = formats[pageFormat] || formats.a4;
          const isPortrait = orientation === 'portrait';
          trimW = isPortrait ? f.w : f.h;
          trimH = isPortrait ? f.h : f.w;
        }

        const bleed = enableKDPMode ? 0.125 * INCH_TO_MM : 0;
        const targetWidthPt = (trimW + 2 * bleed) * MM_TO_POINTS;
        const targetHeightPt = (trimH + 2 * bleed) * MM_TO_POINTS;

        const pagesToEmbed = frontPdfDoc.getPages();
        for (let i = 0; i < pagesToEmbed.length; i++) {
          const embeddedPage = await combinedPdf.embedPage(pagesToEmbed[i]);
          const { width, height } = pagesToEmbed[i].getSize();

          const scale = Math.max(targetWidthPt / width, targetHeightPt / height);
          const newWidth = width * scale;
          const newHeight = height * scale;
          const xOffset = (targetWidthPt - newWidth) / 2;
          const yOffset = (targetHeightPt - newHeight) / 2;

          const newPage = combinedPdf.addPage([targetWidthPt, targetHeightPt]);
          newPage.drawPage(embeddedPage, {
            x: xOffset,
            y: yOffset,
            width: newWidth,
            height: newHeight,
          });
        }

        const mainPages = await combinedPdf.copyPages(mainPdfDoc, mainPdfDoc.getPageIndices());
        mainPages.forEach((page) => combinedPdf.addPage(page));

        finalPdfBytes = await combinedPdf.save();
      }

      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfTitle || 'word_search_puzzles'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Success",
        description: `Your ${generatedPuzzles.length} puzzle PDF has been generated.`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to generate PDF.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGeneratePreview = async (overrideTemplate?: Template, overrideFonts?: any) => {
    try {
      setIsPreviewLoading(true);

      const firstPuzzle = generatedPuzzles[0];
      if (!firstPuzzle && frontMatter.length === 0 && backMatter.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Nothing to Preview',
          description: 'Please generate a puzzle or add a front matter page first.',
        });
        return;
      }

      // Use the premium template builder logic
      const baseTemplate = (overrideTemplate && typeof overrideTemplate === 'object' && 'typography' in overrideTemplate)
        ? overrideTemplate
        : DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

      const template: Template = {
        ...baseTemplate,
        contentBox: {
          ...baseTemplate.contentBox,
          fillColor: baseTemplate.contentBox.fillColor || '#FFFFFF',
          border: {
            ...baseTemplate.contentBox.border,
            width: contentBoxBorderWidth,
            radius: contentBoxBorderRadius,
          }
        },
        pageNumber: {
          ...baseTemplate.pageNumber,
          style: pageNumberStyle,
          position: pageNumberPosition,
          fillColor: pageNumberFillColor,
          textStyle: {
            ...baseTemplate.pageNumber.textStyle,
            color: pageNumberTextColor,
          }
        }
      };

      const isMulti = generationMode === 'multi';
      const levelKey = firstPuzzle ? (firstPuzzle.difficulty.toLowerCase() as keyof typeof multiBackgrounds) : 'easy';

      const previewUrl = await generatePreviewImage(
        template,
        firstPuzzle?.puzzle || DUMMY_PUZZLE,
        {
          template,
          solutionColor,
          titleColor,
          fontSizes,
          fontColors,
          pageFormat,
          orientation,
          layoutMode,
          enableBleed: enableKDPMode,
          trimSize: enableKDPMode ? trimSize : undefined,
          oddBackground: isMulti ? (multiBackgrounds[levelKey].odd || undefined) : (backgroundImages.odd || undefined),
          customFont: customFont || undefined,
          sectionFonts: overrideFonts || sectionFonts,
          seamlessPattern,
          seamlessPatternOpacity,
          isMultiLevel: isMulti,
          frontMatter: frontMatter,
          backMatter: backMatter,
          bookLogo: bookLogo || undefined,
          previewSource: previewPageSource,
          frontMatterPreviewIndex: selectedFMPreviewIndex,
          showPageNumbers: showPageNumbers,
          startPageNumber: startPageNumber,
        }
      );

      setPreviewImage(previewUrl);
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        variant: 'destructive',
        title: 'Preview Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during preview generation.',
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (generatedPuzzles.length > 0 || frontMatter.length > 0) {
      handleGeneratePreview();
    }
  }, [previewPageSource, selectedFMPreviewIndex, generatedPuzzles.length, frontMatter.length]);

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/20 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1800px] mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Multi-Level Book Studio
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Bundle multiple puzzles into a single professional PDF book.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {generatedPuzzles.length > 0 && (
              <div className="hidden md:flex flex-col items-end mr-4">
                <Badge variant="outline" className="px-3 py-1 text-sm font-bold bg-green-50 text-green-700 border-green-200">
                  {generatedPuzzles.length} Puzzles Ready
                </Badge>
              </div>
            )}

            <Button
              onClick={handleExportPDF}
              disabled={isExporting || (generatedPuzzles.length === 0 && frontMatter.length === 0 && !frontMatterPdf)}
              size="lg"
              className="h-12 px-8 text-base font-semibold shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Export Book PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Configuration */}
          <div className="lg:col-span-4 ml-0 space-y-6">

            {/* 1. Puzzle Content (Data) */}
            <Card className="border-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400">
                      <Layers className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">Puzzle Content</CardTitle>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">STEP 1</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {/* Generation Mode */}
                <div className="p-1 bg-muted rounded-lg flex gap-1">
                  <button
                    onClick={() => setGenerationMode('single')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${generationMode === 'single' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:bg-white/50'}`}
                  >Single Level</button>
                  <button
                    onClick={() => setGenerationMode('multi')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${generationMode === 'multi' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:bg-white/50'}`}
                  >Multi-Level</button>
                </div>

                {generationMode === 'single' ? (
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl transition-colors hover:border-indigo-300 dark:hover:border-indigo-800">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5" />
                          Word List (CSV)
                        </Label>
                        {puzzles.length > 0 && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{puzzles.length} loaded</span>}
                      </div>
                      <Button variant="outline" className="w-full h-10 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border-gray-200" onClick={() => csvFileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> {puzzles.length > 0 ? 'Replace CSV File' : 'Upload CSV File'}
                      </Button>
                      <input ref={csvFileInputRef} type="file" accept=".csv" onChange={handleCSVUpload('single')} className="hidden" />

                      <button
                        onClick={() => downloadCSVTemplate()}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors mt-1"
                      >
                        <Download className="h-3 w-3" />
                        Download Single Level Template (.csv)
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Grid Size</Label>
                        <Input type="number" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value) || 15)} className="h-9 bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Difficulty</Label>
                        <div className="h-9 flex items-center justify-center px-3 border rounded text-xs font-bold text-muted-foreground bg-muted/20">AUTO</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <div key={level} className="space-y-1">
                        <div className="flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-gray-900 hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-8 rounded-full ${level === 'easy' ? 'bg-emerald-400' : level === 'medium' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wide">{level}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {level === 'easy' ? easyPuzzles.length : level === 'medium' ? mediumPuzzles.length : hardPuzzles.length} sets
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={() => (level === 'easy' ? easyCsvFileInputRef : level === 'medium' ? mediumCsvFileInputRef : hardCsvFileInputRef).current?.click()}>
                            <Upload className="h-4 w-4 text-gray-500" />
                          </Button>
                          <input ref={level === 'easy' ? easyCsvFileInputRef : level === 'medium' ? mediumCsvFileInputRef : hardCsvFileInputRef} type="file" accept=".csv" onChange={handleCSVUpload(level as any)} className="hidden" />
                        </div>
                        <a
                          href={`/${level}-word-list-template.csv`}
                          download
                          className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-indigo-600 transition-colors ml-1"
                        >
                          <Download className="h-2.5 w-2.5" />
                          Template ({level}.csv)
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <Separator className="opacity-50" />

                <Button
                  onClick={handleGenerateAll}
                  disabled={isGenerating || (generationMode === 'single' ? puzzles.length === 0 : (easyPuzzles.length === 0 && mediumPuzzles.length === 0 && hardPuzzles.length === 0))}
                  className="w-full h-12 text-sm font-bold uppercase tracking-wide shadow-md bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white border-0 transition-all"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Process Words & Generate
                </Button>

              </CardContent>
            </Card>

            {/* 2. Visual & Settings (Accordion) */}
            <div className="space-y-6">
              <Accordion type="single" collapsible defaultValue="design" className="space-y-4">

                {/* DESIGN SECTION */}
                <AccordionItem value="design" className="border-0 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md ring-1 ring-black/5 dark:ring-white/10 px-0 overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-indigo-50/50 dark:data-[state=open]:bg-indigo-900/10 border-b border-transparent data-[state=open]:border-indigo-100 dark:data-[state=open]:border-gray-800 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                      <Palette className="h-4 w-4 text-purple-600" />
                      Visual Style
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-6 pb-6 space-y-6 bg-white/50 dark:bg-gray-900/50">
                    {/* Template Selector */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Design Template</Label>
                      <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                        <SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DEFAULT_TEMPLATES.map(t => {
                            // Restriction for Template 21
                            if (t.id === 'retro-words-premium' && !isAdmin) {
                              return null;
                            }
                            return (
                              <SelectItem key={t.id} value={t.id} className="cursor-pointer font-medium">{t.name}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font Sizes & Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title Color</Label>
                        <div className="flex gap-2 h-9 items-center">
                          <div className="relative h-9 w-9 rounded-lg border overflow-hidden shadow-sm">
                            <input type="color" value={titleColor} onChange={e => setTitleColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer" />
                          </div>
                          <Input value={titleColor} onChange={e => setTitleColor(e.target.value)} className="h-9 w-full text-xs font-mono bg-white" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Highlight</Label>
                        <div className="flex gap-2 h-9 items-center">
                          <div className="relative h-9 w-9 rounded-lg border overflow-hidden shadow-sm">
                            <input type="color" value={solutionColor} onChange={e => setSolutionColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer" />
                          </div>
                          <Input value={solutionColor} onChange={e => setSolutionColor(e.target.value)} className="h-9 w-full text-xs font-mono bg-white" />
                        </div>
                      </div>
                    </div>

                    {/* Custom Font Upload */}
                    <div className="p-4 bg-muted/30 border border-dashed rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold uppercase flex items-center gap-2"><Type className="h-3 w-3" /> Custom Font (TTF)</Label>
                        {customFont && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => setCustomFont(null)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant={customFont?.data ? "default" : "outline"} size="sm" className="h-9 text-[10px]" onClick={() => fontInputRef.current?.click()}>
                          {customFont?.data ? 'Regular Active' : 'Upload Regular'}
                        </Button>
                        <Button variant={customFont?.boldData ? "default" : "outline"} size="sm" className="h-9 text-[10px]" onClick={() => fontBoldInputRef.current?.click()}>
                          {customFont?.boldData ? 'Bold Active' : 'Upload Bold'}
                        </Button>
                      </div>
                      <input ref={fontInputRef} type="file" accept=".ttf" onChange={handleFontUpload(false)} className="hidden" />
                      <input ref={fontBoldInputRef} type="file" accept=".ttf" onChange={handleFontUpload(true)} className="hidden" />
                      <p className="text-[10px] text-muted-foreground italic leading-tight">Recommended for embedding custom fonts that match your theme.</p>
                    </div>

                    {/* Decorative Enhancements */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Seamless Pattern</Label>
                        <Select value={seamlessPattern} onValueChange={(v: any) => setSeamlessPattern(v)}>
                          <SelectTrigger className="h-9 text-xs bg-white dark:bg-gray-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="dots">Minimal Dots</SelectItem>
                            <SelectItem value="polka-dots">Bold Polka Dots</SelectItem>
                            <SelectItem value="grid">Fine Grid</SelectItem>
                            <SelectItem value="dashed-grid">Dashed Grid</SelectItem>
                            <SelectItem value="waves">Soft Waves</SelectItem>
                            <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                            <SelectItem value="chevron">Sharp Chevron</SelectItem>
                            <SelectItem value="islamic">Islamic Geometric</SelectItem>
                            <SelectItem value="flowers">Spring Flowers</SelectItem>
                            <SelectItem value="modern-abstract">Modern Abstract</SelectItem>
                            <SelectItem value="icons">Contextual Icons</SelectItem>
                            <SelectItem value="stars">Modern Stars</SelectItem>
                            <SelectItem value="circles">Artistic Circles</SelectItem>
                            <SelectItem value="confetti">Fun Confetti</SelectItem>
                            <SelectItem value="diamonds">Classic Diamonds</SelectItem>
                            <SelectItem value="triangles">Clean Triangles</SelectItem>
                            <SelectItem value="crosses">Minimal Crosses</SelectItem>
                            <SelectItem value="zen-garden">Oriental Garden</SelectItem>
                            <SelectItem value="random-icons-clean">Modern Icon Scatter</SelectItem>
                            <SelectItem value="random-letters-icons">Alphanumeric Mix</SelectItem>
                            <SelectItem value="random-micro-grid">Micro Icon Grid</SelectItem>
                            <SelectItem value="random-diagonal-flow">Diagonal Icon Flow</SelectItem>
                            <SelectItem value="random-dot-icon">Hybrid Dot-Icon</SelectItem>
                            <SelectItem value="premium-minimal">Premium Minimalist</SelectItem>
                            <SelectItem value="random-clusters">Icon Clustered</SelectItem>
                            <SelectItem value="random-horizontal-drift">Horizontal Drift</SelectItem>
                            <SelectItem value="random-vertical-cascade">Vertical Cascade</SelectItem>
                            <SelectItem value="random-negative-blocks">Negative Space</SelectItem>
                            <SelectItem value="random-letter-cloud">Letter Cloud</SelectItem>
                            <SelectItem value="random-icon-pairs">Paired Icons</SelectItem>
                            <SelectItem value="random-micro-noise">Micro Sized Noise</SelectItem>
                            <SelectItem value="random-offset-waves">Offset Waves</SelectItem>
                            <SelectItem value="random-large-anchors">Large Faded Anchors</SelectItem>
                            <SelectItem value="random-check-rhythm">Checklist Rhythm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {seamlessPattern !== 'none' && (
                        <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pattern Opacity</Label>
                            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {Math.round(seamlessPatternOpacity * 100)}%
                            </span>
                          </div>
                          <Slider
                            value={[seamlessPatternOpacity * 100]}
                            onValueChange={(v) => setSeamlessPatternOpacity(v[0] / 100)}
                            max={100}
                            step={1}
                            className="py-2"
                          />
                          <p className="text-[9px] text-muted-foreground italic">
                            Adjust how subtle or bold the background pattern appears.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Background Images */}
                    <div className="space-y-3 pt-2 border-t border-border/50">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Page Backgrounds</Label>

                      {generationMode === 'single' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant={backgroundImages.odd ? "secondary" : "outline"} size="sm" className="h-9 text-[10px] justify-start px-2" onClick={() => oddImageInputRef.current?.click()}>
                            <ImageIcon className="mr-2 h-3.5 w-3.5 opacity-50" /> {backgroundImages.odd ? 'Odd Page (Set)' : 'Odd Page (Right)'}
                          </Button>
                          <Button variant={backgroundImages.even ? "secondary" : "outline"} size="sm" className="h-9 text-[10px] justify-start px-2" onClick={() => evenImageInputRef.current?.click()}>
                            <ImageIcon className="mr-2 h-3.5 w-3.5 opacity-50" /> {backgroundImages.even ? 'Even Page (Set)' : 'Even Page (Left)'}
                          </Button>
                          <input ref={oddImageInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload('odd')(e)} className="hidden" />
                          <input ref={evenImageInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload('even')(e)} className="hidden" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(['easy', 'medium', 'hard'] as const).map((level) => (
                            <div key={level} className="p-3 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${level === 'easy' ? 'bg-emerald-400' : level === 'medium' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{level} Level</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant={multiBackgrounds[level].odd ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-8 text-[9px] justify-start px-2"
                                  onClick={() => document.getElementById(`odd-bg-${level}`)?.click()}
                                >
                                  <ImageIcon className="mr-1.5 h-3 w-3 opacity-50" />
                                  {multiBackgrounds[level].odd ? '✓ Odd' : 'Odd Page'}
                                </Button>
                                <Button
                                  variant={multiBackgrounds[level].even ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-8 text-[9px] justify-start px-2"
                                  onClick={() => document.getElementById(`even-bg-${level}`)?.click()}
                                >
                                  <ImageIcon className="mr-1.5 h-3 w-3 opacity-50" />
                                  {multiBackgrounds[level].even ? '✓ Even' : 'Even Page'}
                                </Button>
                                <input
                                  id={`odd-bg-${level}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload('odd', level.charAt(0).toUpperCase() + level.slice(1) as any)(e)}
                                  className="hidden"
                                />
                                <input
                                  id={`even-bg-${level}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload('even', level.charAt(0).toUpperCase() + level.slice(1) as any)(e)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          ))}
                          <p className="text-[9px] text-muted-foreground italic leading-tight px-1">Each difficulty level can have unique backgrounds for odd/even pages.</p>
                        </div>
                      )}
                    </div>


                  </AccordionContent>
                </AccordionItem>

                {/* TYPOGRAPHY SECTION */}
                <AccordionItem value="typography" className="border-0 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md ring-1 ring-black/5 dark:ring-white/10 px-0 overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-purple-50/50 dark:data-[state=open]:bg-purple-900/10 border-b border-transparent data-[state=open]:border-purple-100 dark:data-[state=open]:border-gray-800 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                      <Type className="h-4 w-4 text-purple-600" />
                      Typography & Colors
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-6 pb-6 space-y-4 bg-white/50 dark:bg-gray-900/50">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 font-medium">✨ Overriding these settings will deviate from the template's carefully crafted default balance.</p>
                    </div>

                    <div className="space-y-4">
                      {/* 1. Puzzle Title */}
                      <StyleControl
                        label="Puzzle Title"
                        sizeValue={fontSizes.title}
                        onSizeChange={(v: number) => setFontSizes({ ...fontSizes, title: v })}
                        colorValue={fontColors.title}
                        onColorChange={(v: string) => setFontColors({ ...fontColors, title: v })}
                        max={80}
                      />

                      {/* 2. Description */}
                      <StyleControl
                        label="Description Text"
                        sizeValue={fontSizes.description}
                        onSizeChange={(v: number) => setFontSizes({ ...fontSizes, description: v })}
                        colorValue={fontColors.description}
                        onColorChange={(v: string) => setFontColors({ ...fontColors, description: v })}
                        max={24}
                      />

                      {/* 3. Grid Letters */}
                      <StyleControl
                        label="Grid Letters"
                        sizeValue={fontSizes.gridLetters}
                        onSizeChange={(v: number) => setFontSizes({ ...fontSizes, gridLetters: v })}
                        colorValue={fontColors.gridLetters}
                        onColorChange={(v: string) => setFontColors({ ...fontColors, gridLetters: v })}
                        max={32}
                      />

                      {/* 4. Word List Heading */}
                      <StyleControl
                        label="Section Headings"
                        sizeValue={fontSizes.wordListHeading}
                        onSizeChange={(v: number) => setFontSizes({ ...fontSizes, wordListHeading: v })}
                        colorValue={fontColors.wordListHeading}
                        onColorChange={(v: string) => setFontColors({ ...fontColors, wordListHeading: v })}
                        max={40}
                      />

                      {/* 5. Word List Items */}
                      <StyleControl
                        label="Word List Items"
                        sizeValue={fontSizes.wordListItems}
                        onSizeChange={(v: number) => setFontSizes({ ...fontSizes, wordListItems: v })}
                        colorValue={fontColors.wordListItems}
                        onColorChange={(v: string) => setFontColors({ ...fontColors, wordListItems: v })}
                        max={24}
                      />

                      {/* 6. Content Box Outline */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-950 border border-border/50 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900 group">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider group-hover:text-indigo-600 transition-colors">Content Box Outline</Label>
                        <div className="relative h-9 w-9 rounded-lg border-2 border-white dark:border-gray-800 overflow-hidden shadow-md ring-1 ring-black/5 hover:scale-110 transition-transform cursor-pointer">
                          <input
                            type="color"
                            value={fontColors.contentBoxOutline || '#3C3C3C'}
                            onChange={e => setFontColors({ ...fontColors, contentBoxOutline: e.target.value })}
                            className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>



                {/* FRONT MATTER SECTION */}
                <AccordionItem value="front-matter" className="border-0 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md ring-1 ring-black/5 dark:ring-white/10 px-0 overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-amber-50/50 dark:data-[state=open]:bg-amber-900/10 border-b border-transparent data-[state=open]:border-amber-100 dark:data-[state=open]:border-gray-800 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      Intro & Front Matter
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-6 pb-6 space-y-4 bg-white/50 dark:bg-gray-900/50">
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">Create beautiful title pages, instructions, or copyright notices that match your book's theme.</p>

                    {/* Book Logo Upload */}
                    <div className="p-4 border rounded-xl bg-indigo-50/30 dark:bg-indigo-900/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-indigo-900 dark:text-indigo-400">Book Logo</Label>
                          <p className="text-[9px] text-muted-foreground uppercase">Optional: Appears on 1st page</p>
                        </div>
                        <input
                          type="file"
                          id="book-logo-input"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => setBookLogo(re.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Button
                          variant={bookLogo ? "secondary" : "outline"}
                          size="sm"
                          className="h-8 text-[10px]"
                          onClick={() => document.getElementById('book-logo-input')?.click()}
                        >
                          {bookLogo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                      </div>
                      {bookLogo && (
                        <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                          <img src={bookLogo} alt="Logo Preview" className="h-8 w-auto object-contain rounded" />
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setBookLogo(null)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Introductory Pages (Front)</Label>
                    </div>

                    <div className="space-y-3">
                      {frontMatter.map((page, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-xl bg-white hover:border-amber-200 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-xs font-bold truncate max-w-[150px]">{page.title}</div>
                              <div className="text-[9px] text-muted-foreground uppercase">{page.type || 'Standard'}</div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                              setFMForm(page);
                              setEditingFMIndex(idx);
                              setShowFrontMatterDialog(true);
                            }}>
                              <Settings2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                              const next = [...frontMatter];
                              next.splice(idx, 1);
                              setFrontMatter(next);
                              if (selectedFMPreviewIndex >= next.length) setSelectedFMPreviewIndex(Math.max(0, next.length - 1));
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full h-10 border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-bold text-xs"
                        onClick={() => {
                          setFMForm({ title: '', subtitle: '', content: '', type: 'standard', alignment: 'center' });
                          setEditingFMIndex(null);
                          setEditingType('front');
                          setShowFrontMatterDialog(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Introductory Page
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Outro Pages (Back)</Label>
                    </div>

                    <div className="space-y-3">
                      {backMatter.map((page, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-xl bg-white hover:border-amber-200 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-xs font-bold truncate max-w-[150px]">{page.title}</div>
                              <div className="text-[9px] text-muted-foreground uppercase">{page.type || 'Standard'}</div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                              setFMForm(page);
                              setEditingFMIndex(idx);
                              setEditingType('back');
                              setShowFrontMatterDialog(true);
                            }}>
                              <Settings2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                              const next = [...backMatter];
                              next.splice(idx, 1);
                              setBackMatter(next);
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full h-10 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold text-xs"
                        onClick={() => {
                          setFMForm({ title: '', subtitle: '', content: '', type: 'standard', alignment: 'center' });
                          setEditingFMIndex(null);
                          setEditingType('back');
                          setShowFrontMatterDialog(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Outro Page
                      </Button>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Original PDF Merge</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={frontMatterPdf ? "secondary" : "outline"}
                          className={`flex-1 h-10 border-dashed transition-all ${frontMatterPdf ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100' : 'hover:border-primary hover:bg-primary/5'}`}
                          onClick={() => frontMatterInputRef.current?.click()}
                        >
                          {frontMatterPdf ? (
                            <span className="flex items-center gap-2 truncate px-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{frontMatterPdf.name}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Plus className="w-3.5 h-3.5" />
                              Upload External PDF
                            </span>
                          )}
                        </Button>
                        {frontMatterPdf && (
                          <Button variant="ghost" size="icon" onClick={() => setFrontMatterPdf(null)} className="text-red-500 h-10 w-10 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* PAGE & PRINT SECTION */}
                <AccordionItem value="print" className="border-0 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md ring-1 ring-black/5 dark:ring-white/10 px-0 overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-blue-50/50 dark:data-[state=open]:bg-blue-900/10 border-b border-transparent data-[state=open]:border-blue-100 dark:data-[state=open]:border-gray-800 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-foreground">
                      <Printer className="h-4 w-4 text-blue-600" />
                      Print & KDP
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-6 pb-6 space-y-6 bg-white/50 dark:bg-gray-900/50">
                    {/* Page Format */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Format</Label>
                        <Select value={pageFormat} onValueChange={(v) => setPageFormat(v as any)}><SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="a4">A4</SelectItem><SelectItem value="letter">Letter</SelectItem><SelectItem value="6x9">6 x 9 inches</SelectItem><SelectItem value="a5">A5</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Orientation</Label>
                        <Select value={orientation} onValueChange={(v) => setOrientation(v as any)}><SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="portrait">Portrait</SelectItem><SelectItem value="landscape">Landscape</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:bg-blue-900/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-blue-800 dark:text-blue-300">KDP Print Mode</Label>
                          <p className="text-[10px] text-muted-foreground">Sets margins, bleed & trim</p>
                        </div>
                        <Switch checked={enableKDPMode} onCheckedChange={setEnableKDPMode} />
                      </div>
                      {enableKDPMode && (
                        <div className="space-y-3 pt-3 border-t border-blue-200/50">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase">Trim Size</Label>
                            <Select value={trimSize} onValueChange={(v) => {
                              setTrimSize(v as any);
                              if (v === '6x9') {
                                setGridSizes({ easy: 14, medium: 15, hard: 16 });
                              }
                            }}><SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="8.5x11">8.5 x 11 inches</SelectItem>
                                <SelectItem value="6x9">6 x 9 inches (Standard)</SelectItem>
                                <SelectItem value="8x10">8 x 10 inches</SelectItem>
                                <SelectItem value="8x5">8 x 5 inches</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Page Numbering</Label>
                      <div className="flex items-center justify-between border p-3 rounded-lg bg-white/50">
                        <span className="text-xs font-medium">Show Numbers</span>
                        <Switch checked={showPageNumbers} onCheckedChange={setShowPageNumbers} />
                      </div>
                      {showPageNumbers && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-in fade-in slide-in-from-top-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-medium">Start From</Label>
                              <Input type="number" placeholder="1" value={startPageNumber} onChange={e => setStartPageNumber(parseInt(e.target.value) || 1)} className="h-9 text-xs bg-white" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] font-medium">Position</Label>
                              <Select value={pageNumberPosition} onValueChange={(v) => setPageNumberPosition(v as any)}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                  <SelectItem value="bottom-outer">Bottom Outer</SelectItem>
                                  <SelectItem value="top-center">Top Center</SelectItem>
                                  <SelectItem value="top-outer">Top Outer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium">Style</Label>
                            <Select value={pageNumberStyle} onValueChange={(v) => setPageNumberStyle(v as any)}>
                              <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="simple">Simple (1, 2, 3)</SelectItem>
                                <SelectItem value="circle">Circle</SelectItem>
                                <SelectItem value="roman">Roman (i, ii, iii)</SelectItem>
                                <SelectItem value="roman-caps">Roman Caps (I, II, III)</SelectItem>
                                <SelectItem value="accent-bar">Accent Bar</SelectItem>
                                <SelectItem value="brackets">Brackets [1]</SelectItem>
                                <SelectItem value="elegant-dash">Elegant Dash - 1 -</SelectItem>
                                <SelectItem value="modern-box">Modern Box</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-medium">Fill Color</Label>
                              <div className="flex gap-2 h-9 items-center">
                                <div className="relative h-9 w-9 rounded-lg border overflow-hidden shadow-sm">
                                  <input type="color" value={pageNumberFillColor} onChange={e => setPageNumberFillColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer" />
                                </div>
                                <Input value={pageNumberFillColor} onChange={e => setPageNumberFillColor(e.target.value)} className="h-9 w-full text-xs font-mono bg-white" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] font-medium">Text Color</Label>
                              <div className="flex gap-2 h-9 items-center">
                                <div className="relative h-9 w-9 rounded-lg border overflow-hidden shadow-sm">
                                  <input type="color" value={pageNumberTextColor} onChange={e => setPageNumberTextColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer" />
                                </div>
                                <Input value={pageNumberTextColor} onChange={e => setPageNumberTextColor(e.target.value)} className="h-9 w-full text-xs font-mono bg-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">External PDF Merge</Label>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">Upload a PDF for title page, copyright, or instructions to merge at the start of your book.</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={frontMatterPdf ? "secondary" : "outline"}
                          className={`flex-1 h-10 border-dashed transition-all ${frontMatterPdf ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100' : 'hover:border-primary hover:bg-primary/5'}`}
                          onClick={() => frontMatterInputRef.current?.click()}
                        >
                          {frontMatterPdf ? (
                            <span className="flex items-center gap-2 truncate px-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{frontMatterPdf.name}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Plus className="w-3.5 h-3.5" />
                              Select PDF File
                            </span>
                          )}
                        </Button>
                        {frontMatterPdf && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setFrontMatterPdf(null)}
                            className="text-red-500 h-10 w-10 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={frontMatterInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFrontMatterPdf(f);
                        }}
                      />
                    </div>

                    <div className="pt-2">
                      <div className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${!isPro ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs font-bold">Flatten PDF</Label>
                            {!isPro && <Badge variant="secondary" className="text-[8px] h-3 px-1 bg-indigo-100 text-indigo-700 border-indigo-200 uppercase">PRO</Badge>}
                          </div>
                          <p className="text-[10px] text-muted-foreground">Resolves font embedding issues</p>
                        </div>
                        <Switch
                          checked={isPro ? flattenPdf : false}
                          onCheckedChange={setFlattenPdf}
                          disabled={!isPro}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${!isPro ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs font-bold">High Quality Print</Label>
                            {!isPro && <Badge variant="secondary" className="text-[8px] h-3 px-1 bg-indigo-100 text-indigo-700 border-indigo-200 uppercase">PRO</Badge>}
                          </div>
                          <p className="text-[10px] text-muted-foreground">300 DPI high resolution output</p>
                        </div>
                        <Switch
                          checked={isPro ? highQualityPrint : false}
                          onCheckedChange={setHighQualityPrint}
                          disabled={!isPro}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {status === 'authenticated' && !isPro && (
              <Card className="border-2 border-indigo-200 bg-indigo-50/50 overflow-hidden shadow-md mt-6">
                <CardHeader className="bg-indigo-100/50 p-4 border-b border-indigo-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-sm font-bold text-indigo-900 uppercase tracking-tight">Upgrade to PRO</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[11px] text-indigo-800 font-bold uppercase tracking-wider">PRO Studio Benefits:</p>
                    <ul className="space-y-1.5">
                      {[
                        'Unlimited puzzle books',
                        'Multi-level difficulty support',
                        'High Quality 300 DPI Print',
                        'KDP Ready PDF Flattening',
                        'Custom Font & SVG support',
                        'Advanced styling & backgrounds',
                        'Premium Layout Templates'
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px] text-indigo-900/80 font-medium">
                          <CheckCircle2 className="h-3 w-3 text-indigo-600 shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-indigo-200 space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-indigo-900 uppercase">PRO Monthly Access</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-black">$99</span>
                    </div>
                    <Separator className="bg-indigo-100" />
                    <div className="space-y-2">
                      <p className="text-[10px] text-indigo-800 leading-relaxed">
                        To activate your Pro account, please contact us via WhatsApp to complete the payment.
                      </p>
                      <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 text-xs font-bold shadow-sm" asChild>
                        <a href="https://wa.me/923059051007?text=I%20want%20to%20upgrade%20to%20Pro%20for%20Word%20Search%20Studio" target="_blank" rel="noopener noreferrer">
                          Contact Admin via WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>

                  <p className="text-[9px] text-center text-slate-400 font-medium italic">
                    Plan updates are reflected instantly on refresh.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: Preview & Workspace */}
          <div className="lg:col-span-8 lg:sticky lg:top-8 space-y-6">
            <Card className="border-0 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 bg-slate-100/50 dark:bg-slate-900/30 overflow-hidden min-h-[850px] flex flex-col backdrop-blur-sm">
              <div className="p-4 border-b bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Book Preview</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex bg-muted p-1 rounded-lg mr-2">
                    <button
                      onClick={() => setPreviewPageSource('puzzle')}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${previewPageSource === 'puzzle' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:bg-white/50'}`}
                    >Puzzle</button>
                    <button
                      onClick={() => {
                        if (frontMatter.length === 0) {
                          toast({ title: "No Front Matter", description: "Add a front matter page first in the left sidebar." });
                          return;
                        }
                        setPreviewPageSource('front-matter');
                        setSelectedFMPreviewIndex(0);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${previewPageSource === 'front-matter' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:bg-white/50'}`}
                    >Front</button>
                    <button
                      onClick={() => {
                        if (backMatter.length === 0) {
                          toast({ title: "No Outro Pages", description: "Add an outro page first in the left sidebar." });
                          return;
                        }
                        setPreviewPageSource('back-matter');
                        setSelectedFMPreviewIndex(0);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${previewPageSource === 'back-matter' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:bg-white/50'}`}
                    >Back</button>
                  </div>
                  {(previewPageSource === 'front-matter' || previewPageSource === 'back-matter') && (previewPageSource === 'front-matter' ? frontMatter.length : backMatter.length) > 1 && (
                    <Select
                      value={selectedFMPreviewIndex.toString()}
                      onValueChange={(v) => setSelectedFMPreviewIndex(parseInt(v))}
                    >
                      <SelectTrigger className="h-9 w-24 text-[10px] bg-white"><SelectValue placeholder="Page" /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: previewPageSource === 'front-matter' ? frontMatter.length : backMatter.length }).map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>Page {i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => handleGeneratePreview()} className="h-9">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isPreviewLoading ? 'animate-spin' : ''}`} /> Refresh Preview
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8 md:p-12 flex items-center justify-center bg-[url('https://res.cloudinary.com/dpv0ukspz/image/upload/v1684366620/dot-grid_balg4g.png')] bg-[length:24px_24px] transition-colors hover:bg-gray-200/20">
                {previewImage ? (
                  <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-8 scale-95 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                    <img
                      src={previewImage}
                      alt="Book Preview"
                      className="relative z-10 max-w-full h-auto max-h-[750px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-[1px] border-white/50 rounded-sm transform transition-all duration-500 will-change-transform"
                    />
                    {/* Floating Badges */}
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="bg-black/75 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Page {orientation} • {pageFormat.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-30 select-none">
                    <div className="w-32 h-44 border-4 border-dashed rounded-xl flex items-center justify-center bg-white/20">
                      <BookOpen className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold">Preview Area</p>
                      <p className="text-xs max-w-xs mx-auto">Upload a CSV and click 'Process & Generate' to visualize your word search book here.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Front Matter Editor Dialog */}
      <Dialog open={showFrontMatterDialog} onOpenChange={setShowFrontMatterDialog}>
        <DialogContent className="max-w-xl bg-white dark:bg-gray-950">
          <DialogHeader>
            <DialogTitle>{editingFMIndex !== null ? 'Edit Introductory Page' : 'Add Introductory Page'}</DialogTitle>
            <DialogDescription>Create a decorative page that appears at the start of your book.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Page Type</Label>
                <Select value={fmForm.type} onValueChange={(v: any) => setFMForm({ ...fmForm, type: v })}>
                  <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Content</SelectItem>
                    <SelectItem value="title-page">Main Title Page (Large)</SelectItem>
                    <SelectItem value="how-to-use">How to Use (with Example)</SelectItem>
                    <SelectItem value="copyright">Copyright (Bottom Aligned)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Text Alignment</Label>
                <Select value={fmForm.alignment} onValueChange={(v: any) => setFMForm({ ...fmForm, alignment: v })}>
                  <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Primary Title</Label>
              <Input value={fmForm.title} onChange={e => setFMForm({ ...fmForm, title: e.target.value })} placeholder="e.g. Volume 01: Hidden Wonders" className="h-10" />
            </div>

            {fmForm.type === 'title-page' && (
              <div className="space-y-2">
                <Label className="text-xs font-bold">Subtitle / Author Line</Label>
                <Input value={fmForm.subtitle} onChange={e => setFMForm({ ...fmForm, subtitle: e.target.value })} placeholder="e.g. By Puzzle Master Studio" className="h-10" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold">Main Content / Instructions</Label>
                <span className="text-[10px] text-muted-foreground">Supports multi-line text</span>
              </div>
              <Textarea
                value={fmForm.content}
                onChange={e => setFMForm({ ...fmForm, content: e.target.value })}
                placeholder="Type your introductory text, instructions, or copyright details here..."
                className="min-h-[150px] resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Font Size ({fmForm.fontSize || 12}pt)</Label>
              <Slider value={[fmForm.fontSize || 12]} min={8} max={36} step={1} onValueChange={([v]) => setFMForm({ ...fmForm, fontSize: v })} />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 h-11" onClick={() => setShowFrontMatterDialog(false)}>Cancel</Button>
            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700" onClick={() => {
              if (editingType === 'front') {
                const next = [...frontMatter];
                if (editingFMIndex !== null) next[editingFMIndex] = fmForm;
                else next.push(fmForm);
                setFrontMatter(next);
              } else {
                const next = [...backMatter];
                if (editingFMIndex !== null) next[editingFMIndex] = fmForm;
                else next.push(fmForm);
                setBackMatter(next);
              }
              setShowFrontMatterDialog(false);
            }}>{editingFMIndex !== null ? 'Update Page' : 'Add Page to Book'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pro Access Dialog for Free Users */}
      <Dialog open={showProPrompt} onOpenChange={setShowProPrompt}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-indigo-600 p-8 text-center text-white space-y-4">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md animate-pulse">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">UPGRADE TO PRO STUDIO</h2>
            <p className="text-indigo-100 font-medium">Unlock the full power of Multi-Level Book Builder</p>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Unlimited Pages', desc: 'No 10-page limit on PDF books.' },
                { title: 'KDP Print Ready', desc: 'Perfect margins, bleed & trim.' },
                { title: '300 DPI Export', desc: 'Crystal clear professional printing.' },
                { title: 'All Difficulties', desc: 'Easy, Medium & Hard in one book.' },
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
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PRO Monthly Access</span>
                <div className="text-4xl font-black text-indigo-600 tracking-tight">$99</div>
                <p className="text-xs text-slate-500">Full professional access for 30 days.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" asChild>
                  <a href="https://wa.me/923059051007?text=I%20want%20to%20upgrade%20to%20the%20PRO%20STUDIO" target="_blank">
                    Upgrade to PRO via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
