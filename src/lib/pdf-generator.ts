import { jsPDF } from 'jspdf';
import type { PuzzleData, PageSpec, Template, LayoutMode } from './types';
import { DEFAULT_TEMPLATES } from './templates';

// Re-export types for convenience
export type { LayoutMode } from './types';

const INCH_TO_MM = 25.4;
const PT_TO_MM = 0.3528;

export const DEFAULT_PAGE_SPEC: PageSpec = {
    trimWidth: 8.5 * INCH_TO_MM,
    trimHeight: 11 * INCH_TO_MM,
    bleed: {
        top: 0.125 * INCH_TO_MM,
        bottom: 0.125 * INCH_TO_MM,
        outer: 0.125 * INCH_TO_MM,
        inner: 0,
    },
    margins: {
        top: 0.75 * INCH_TO_MM,
        bottom: 0.9 * INCH_TO_MM,
        inside: 0.75 * INCH_TO_MM,
        outside: 0.75 * INCH_TO_MM,
    }
};

const TRIM_SIZES = {
    '8.5x11': {
        width: 8.5 * INCH_TO_MM,
        height: 11 * INCH_TO_MM,
        margins: {
            top: 0.75 * INCH_TO_MM,
            bottom: 0.9 * INCH_TO_MM,
            inside: 0.75 * INCH_TO_MM,
            outside: 0.75 * INCH_TO_MM,
        }
    },
    '6x9': {
        width: 6 * INCH_TO_MM,
        height: 9 * INCH_TO_MM,
        margins: {
            top: 0.5 * INCH_TO_MM,
            bottom: 0.75 * INCH_TO_MM,
            inside: 0.75 * INCH_TO_MM,
            outside: 0.5 * INCH_TO_MM,
        }
    },
    '8x10': {
        width: 8 * INCH_TO_MM,
        height: 10 * INCH_TO_MM,
        margins: {
            top: 0.75 * INCH_TO_MM,
            bottom: 0.9 * INCH_TO_MM,
            inside: 0.75 * INCH_TO_MM,
            outside: 0.75 * INCH_TO_MM,
        }
    },
    '8x5': {
        width: 8 * INCH_TO_MM,
        height: 5 * INCH_TO_MM,
        margins: {
            top: 0.75 * INCH_TO_MM,
            bottom: 0.9 * INCH_TO_MM,
            inside: 0.75 * INCH_TO_MM,
            outside: 0.75 * INCH_TO_MM,
        }
    },
} as const;

// Legacy page formats (for backward compatibility)
const PAGE_FORMATS = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    a5: { width: 148, height: 210 },
    '6x9': { width: 6 * INCH_TO_MM, height: 9 * INCH_TO_MM },
    'b5': { width: 176, height: 250 },
} as const;

export type TrimSize = keyof typeof TRIM_SIZES;
export type PrintType = 'paperback' | 'hardcover';
export type PageFormat = keyof typeof PAGE_FORMATS;
export type PageOrientation = 'portrait' | 'landscape';

interface PuzzlePage {
    puzzle: PuzzleData;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    title: string;
    description?: string;
    backgroundImage?: string; // Legacy/Fallback
    oddBackground?: string;
    evenBackground?: string;
}

export interface FrontMatterPage {
    title: string;
    subtitle?: string;
    content: string;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: number;
    type?: 'title-page' | 'standard' | 'copyright' | 'how-to-use';
}

interface PDFCustomization {
    template?: Template; // The new template system!
    frontMatter?: FrontMatterPage[];
    backMatter?: FrontMatterPage[];
    frontMatterPageCount?: number; // Legacy or for external PDF offset
    bookLogo?: string; // Base64 logo for the first page

    // Global overrides (optional)
    solutionColor?: string;
    titleColor?: string;
    pageFormat?: PageFormat;
    orientation?: PageOrientation;
    layoutMode?: LayoutMode;

    // KDP Print Settings
    printType?: PrintType;
    trimSize?: TrimSize;
    enableBleed?: boolean; // If true, use KDP print mode with bleed
    oddBackground?: string;
    evenBackground?: string;

    // PDF Metadata
    pdfTitle?: string;
    pdfAuthor?: string;
    showPageNumbers?: boolean;
    startPageNumber?: number;
    pageNumberColor?: string;

    // Font / Typography Overrides
    fontSizes?: {
        title?: number;
        description?: number;
        gridLetters?: number;
        wordListHeading?: number;
        wordListItems?: number;
        solutionTitle?: number;
    };
    fontColors?: {
        title?: string;
        description?: string;
        gridLetters?: string;
        wordListHeading?: string;
        wordListItems?: string;
        contentBoxOutline?: string;
    };
    customFont?: {
        name: string;
        data: string; // Base64
        boldData?: string; // Optional bold variant
    };
    sectionFonts?: {
        title?: { name: string; data: string };
        description?: { name: string; data: string };
        grid?: { name: string; data: string };
        wordList?: { name: string; data: string };
    };
    flattenPdf?: boolean;
    highQualityPrint?: boolean;
    seamlessPattern?: 'none' | 'dots' | 'grid' | 'waves' | 'diagonal' | 'icons' | 'stars' | 'circles' | 'confetti' | 'honeycomb' | 'diamonds' | 'crosses' | 'triangles' | 'chevron' | 'islamic' | 'leaves' | 'flowers' | 'modern-abstract' | 'polka-dots' | 'dashed-grid';
    seamlessPatternOpacity?: number;
    isMultiLevel?: boolean;
    frontMatterPreviewIndex?: number;
    previewSource?: 'puzzle' | 'front-matter' | 'back-matter';
}

function cleanString(str: string): string {
    if (!str) return '';
    // Remove null bytes and normalize
    return str.replace(/\0/g, '').normalize('NFC');
}

function toRoman(num: number): string {
    const lookup: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (let i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

const DUMMY_EXAMPLE_PUZZLE: PuzzleData = {
    grid: [
        ['S', 'O', 'L', 'U', 'T', 'I', 'O', 'N'],
        ['W', 'O', 'R', 'D', 'S', 'G', 'O', 'H'],
        ['H', 'E', 'R', 'E', 'N', 'O', 'W', 'E'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L'],
        ['M', 'A', 'S', 'T', 'E', 'R', 'S', 'P'],
        ['U', 'N', 'I', 'Q', 'U', 'E', 'J', 'S'],
        ['G', 'R', 'I', 'D', 'S', 'K', 'L', 'M'],
        ['X', 'Y', 'Z', 'W', 'O', 'R', 'L', 'D']
    ],
    words: [
        { id: 1, word: 'SOLUTION', row: 0, col: 0, direction: 'horizontal' },
        { id: 2, word: 'WORDS', row: 1, col: 0, direction: 'horizontal' },
        { id: 3, word: 'MASTER', row: 4, col: 0, direction: 'horizontal' },
        { id: 4, word: 'GRIDS', row: 6, col: 0, direction: 'horizontal' },
    ],
    unplacedWords: []
};

// Helper to get formatted section font name
function getSectionFont(pdf: jsPDF, section: 'title' | 'description' | 'grid' | 'wordList', defaultFamily: string, customization?: PDFCustomization): string {
    const sectionUpper = section.charAt(0).toUpperCase() + section.slice(1);
    const sectionName = `CustomFont${sectionUpper}`;
    const globalName = 'CustomFont';

    // A helper to verify if a font exists in jsPDF
    const fontExists = (name: string) => {
        const fontList = pdf.getFontList();
        return !!fontList[name];
    };

    // Priority: Custom Global Font (Uploaded) -> Section Font (Google Font) -> Template Default
    // UNLESS it's the grid - the grid should always stay as template default (Roboto/Mono) for readability
    if (section !== 'grid' && customization?.customFont && fontExists(globalName)) {
        return globalName;
    }
    if (customization?.sectionFonts?.[section] && fontExists(sectionName)) {
        return sectionName;
    }

    // Map template defaults to standard PDF fonts
    const f = (defaultFamily || '').toLowerCase();
    if (f.includes('serif') || f.includes('times') || f.includes('alfa') || f.includes('baskerville') || f.includes('georgia')) return 'times';
    if (f.includes('mono') || f.includes('courier')) return 'courier';
    return 'helvetica';
}

/**
 * Safe wrapper for pdf.setFont to prevent metric crashes
 */
function safeSetFont(pdf: jsPDF, fontName: string, style: string = 'normal') {
    try {
        pdf.setFont(fontName, style);
        // Test font metrics to ensure it won't crash on text()
        (pdf as any).getStringUnitWidth('A');
    } catch (e) {
        // More intelligent fallback: try times if it looks serif-ish
        // We check the requested font name OR the template's designated families
        const name = (fontName || '').toLowerCase();
        let fallback = 'helvetica';
        if (name.includes('times') || name.includes('serif') || name.includes('alfa') || name.includes('baskerville') || name.includes('slab')) {
            fallback = 'times';
        }
        console.warn(`Font ${fontName} (${style}) failed metrics check, falling back to ${fallback}.`);
        pdf.setFont(fallback, style);
    }
}

// Global scaling factor for smaller pages (like 6x9)
function getScalingFactor(pageWidth: number, pageHeight: number): number {
    const standardWidth = 8.5 * INCH_TO_MM;
    const standardHeight = 11 * INCH_TO_MM;
    const standardArea = standardWidth * standardHeight;
    const currentArea = pageWidth * pageHeight;

    // Linearly scale based on the square root of area ratio
    // but cap it between 0.7 and 1.0 to avoid extreme shrinking or growing
    const ratio = Math.sqrt(currentArea / standardArea);
    return Math.max(0.7, Math.min(1.0, ratio));
}

// Helper function to calculate mirrored margins
function getMirroredMargins(
    isLeftPage: boolean,
    pageSpec: PageSpec,
): { left: number; right: number; top: number; bottom: number } {
    const trimLeft = isLeftPage ? pageSpec.bleed.outer : pageSpec.bleed.inner;

    if (!isLeftPage) { // Odd page / Right-hand
        return {
            top: pageSpec.bleed.top + pageSpec.margins.top,
            bottom: pageSpec.bleed.top + pageSpec.trimHeight - pageSpec.margins.bottom,
            left: trimLeft + pageSpec.margins.inside,
            right: trimLeft + pageSpec.trimWidth - pageSpec.margins.outside,
        };
    } else { // Even page / Left-hand
        return {
            top: pageSpec.bleed.top + pageSpec.margins.top,
            bottom: pageSpec.bleed.top + pageSpec.trimHeight - pageSpec.margins.bottom,
            left: trimLeft + pageSpec.margins.outside,
            right: trimLeft + pageSpec.trimWidth - pageSpec.margins.inside,
        };
    }
}

export async function generateMultiLevelPDF(
    puzzles: PuzzlePage[],
    backgroundImage?: string,
    customization?: PDFCustomization
): Promise<ArrayBuffer> {
    const enableBleed = customization?.enableBleed ?? false;
    // Default to Classic template if none provided
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const layoutMode = customization?.layoutMode || template.layout;

    // Current page specification
    const pageSpec = JSON.parse(JSON.stringify(DEFAULT_PAGE_SPEC));
    if (customization?.trimSize) {
        const trim = TRIM_SIZES[customization.trimSize] as any;
        pageSpec.trimWidth = trim.width;
        pageSpec.trimHeight = trim.height;
        if (trim.margins) {
            pageSpec.margins = { ...trim.margins };
        }
        // Special case for 6.25 x 9.25 bleed as per user request
        if (customization.trimSize === '6x9' && (customization.enableBleed ?? false)) {
            pageSpec.bleed.inner = 0.125 * INCH_TO_MM;
        }
    } else if (customization?.pageFormat) {
        const format = PAGE_FORMATS[customization.pageFormat];
        const isPortrait = (customization?.orientation || 'portrait') === 'portrait';
        pageSpec.trimWidth = isPortrait ? format.width : format.height;
        pageSpec.trimHeight = isPortrait ? format.height : format.width;
    }

    if (!enableBleed) {
        pageSpec.bleed = { top: 0, bottom: 0, outer: 0, inner: 0 };
        // For non-bleed, let's use equal margins if it's legacy mode
        if (!customization?.trimSize) {
            pageSpec.margins.top = 20;
            pageSpec.margins.bottom = 20;
            pageSpec.margins.inside = 20;
            pageSpec.margins.outside = 20;
        }
    }

    const pageWidth = pageSpec.trimWidth + pageSpec.bleed.outer + pageSpec.bleed.inner;
    const pageHeight = pageSpec.trimHeight + pageSpec.bleed.top + pageSpec.bleed.bottom;

    // Determine a global fallback background to ensure no pages are blank
    // Priority: Customization (Odd/Even) -> Global background arg -> Level-specific backgrounds
    const oddBg = customization?.oddBackground || backgroundImage || puzzles.find(p => p.oddBackground)?.oddBackground || puzzles.find(p => p.backgroundImage)?.backgroundImage;
    const evenBg = customization?.evenBackground || customization?.oddBackground || backgroundImage || puzzles.find(p => p.evenBackground)?.evenBackground || puzzles.find(p => p.backgroundImage)?.backgroundImage;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageWidth, pageHeight],
        compress: !customization?.highQualityPrint,
    });

    // Handle custom font embedding for KDP compliance
    const fontName = await registerFonts(pdf, customization);

    // Set PDF metadata
    pdf.setProperties({
        title: customization?.pdfTitle || 'Word Search Puzzles',
        author: customization?.pdfAuthor || 'Word Search Generator',
        creator: 'Word Search Generator App',
    });

    // Start content on the first page (no blank page)
    const startPageNumber = customization?.startPageNumber || 1;
    const frontMatterOffset = (customization?.frontMatterPageCount || 0) + (customization?.frontMatter?.length || 0);

    let pageStarted = false;

    // 0. Programmatic Front Matter
    if (customization?.frontMatter && customization.frontMatter.length > 0) {
        let idx = 0;
        for (const fmPage of customization.frontMatter) {
            if (pageStarted) pdf.addPage();
            pageStarted = true;

            const internalPageNum = pdf.getNumberOfPages();
            const bookPageNum = internalPageNum + (customization.frontMatterPageCount || 0); // Offset by external PDF if any
            const isLeftPage = bookPageNum % 2 === 0;
            const currentBg = isLeftPage ? evenBg : oddBg;

            const samplePuzzle = puzzles.length > 0 ? puzzles[0] : undefined;
            await addCustomFrontMatterPage(pdf, fmPage, currentBg, customization, pageWidth, pageHeight, pageSpec, isLeftPage, idx === 0, samplePuzzle);

            if (customization?.showPageNumbers) {
                const actualPageNum = internalPageNum + startPageNumber - 1;
                drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftPage);
            }
            idx++;
        }
    }

    const isMultiLevel = customization?.isMultiLevel === true;

    if (isMultiLevel && puzzles.some(p => p.difficulty === 'Easy')) {
        const internalPageNum = pdf.getNumberOfPages();
        const actualPageNum = internalPageNum + startPageNumber - 1;
        const bookPageNum = internalPageNum + frontMatterOffset;
        const isLeftPage = bookPageNum % 2 === 0;

        // Find backgrounds for this level
        const firstEasy = puzzles.find(p => p.difficulty === 'Easy');
        const levelOddBg = firstEasy?.oddBackground || customization?.oddBackground || backgroundImage || firstEasy?.backgroundImage;
        const levelEvenBg = firstEasy?.evenBackground || customization?.evenBackground || levelOddBg;

        const currentBg = isLeftPage ? levelEvenBg : levelOddBg;
        await addDifficultySeparatorPage(pdf, 'Easy', pageWidth, pageHeight, pageSpec, customization, currentBg);
        pageStarted = true;

        if (customization?.showPageNumbers) {
            drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftPage);
        }
    }

    for (const puzzleGroup of [
        { difficulty: 'Easy', puzzles: puzzles.filter(p => p.difficulty === 'Easy') },
        { difficulty: 'Medium', puzzles: puzzles.filter(p => p.difficulty === 'Medium') },
        { difficulty: 'Hard', puzzles: puzzles.filter(p => p.difficulty === 'Hard') }
    ]) {
        if (puzzleGroup.puzzles.length > 0) {
            // Add separator for Medium and Hard (Easy is already added as the very first page)
            if (isMultiLevel && puzzleGroup.difficulty !== 'Easy') {
                pdf.addPage();
                const internalPageNum = pdf.getNumberOfPages();
                const actualPageNum = internalPageNum + startPageNumber - 1;
                const bookPageNum = internalPageNum + frontMatterOffset;
                const isLeftPage = bookPageNum % 2 === 0;

                const firstInLevel = puzzleGroup.puzzles[0];
                const levelOddBg = firstInLevel?.oddBackground || customization?.oddBackground || backgroundImage || firstInLevel?.backgroundImage;
                const levelEvenBg = firstInLevel?.evenBackground || customization?.evenBackground || levelOddBg;

                const currentBg = isLeftPage ? levelEvenBg : levelOddBg;
                await addDifficultySeparatorPage(pdf, puzzleGroup.difficulty as any, pageWidth, pageHeight, pageSpec, customization, currentBg);
                pageStarted = true;

                if (customization?.showPageNumbers) {
                    drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, customization);
                }
            }

            for (const puzzlePage of puzzleGroup.puzzles) {
                if (pageStarted) {
                    pdf.addPage();
                }
                pageStarted = true;
                const internalPageNum = pdf.getNumberOfPages();
                const actualPageNum = internalPageNum + startPageNumber - 1;
                const bookPageNum = internalPageNum + frontMatterOffset;
                const isLeftPage = bookPageNum % 2 === 0;

                const pOddBg = puzzlePage.oddBackground || customization?.oddBackground || backgroundImage || puzzlePage.backgroundImage;
                const pEvenBg = puzzlePage.evenBackground || customization?.evenBackground || pOddBg;

                const currentBg = isLeftPage ? pEvenBg : pOddBg;
                await addPuzzlePage(pdf, puzzlePage, currentBg, customization, pageWidth, pageHeight, pageSpec, isLeftPage, layoutMode, actualPageNum);

                if (customization?.showPageNumbers) {
                    // Skip automatic drawing if it's already handled by a custom template logic (like Retro top position)
                    const isRetroTop = template.id.includes('retro') && template.pageNumber.position.startsWith('top');
                    if (!isRetroTop) {
                        drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftPage);
                    }
                }
            }
        }
    }

    // Add Solutions Separator
    if (pageStarted) {
        pdf.addPage();
    }
    pageStarted = true;
    const internalSolSepPageNum = pdf.getNumberOfPages();
    const actualSolSepPageNum = internalSolSepPageNum + startPageNumber - 1;
    const bookSolSepPageNum = internalSolSepPageNum + frontMatterOffset;
    const isLeftSolutionsSep = bookSolSepPageNum % 2 === 0;
    const currentBgSolutionsSep = isLeftSolutionsSep ? evenBg : oddBg;
    await addSolutionsSeparatorPage(pdf, pageWidth, pageHeight, pageSpec, customization, currentBgSolutionsSep);

    if (customization?.showPageNumbers) {
        drawPageNumber(pdf, actualSolSepPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftSolutionsSep);
    }

    // Add Solutions Pages (starting on a new page)
    if (pageStarted) {
        pdf.addPage();
    }
    pageStarted = true;
    const solutionsStartInternalPageNum = pdf.getNumberOfPages();
    const solutionsStartActualPageNum = solutionsStartInternalPageNum + startPageNumber - 1;
    await addSolutionsPage(pdf, puzzles, oddBg, evenBg, customization, pageWidth, pageHeight, pageSpec, solutionsStartActualPageNum);

    // Ensure even number of pages for KDP compliance
    let totalPages = pdf.getNumberOfPages();
    if (enableBleed && totalPages % 2 !== 0) {
        pdf.addPage();
        const finalInternalPageNum = pdf.getNumberOfPages();
        const actualFinalPageNum = finalInternalPageNum + startPageNumber - 1;
        const bookFinalPageNum = finalInternalPageNum + frontMatterOffset;
        const isLeftFinal = bookFinalPageNum % 2 === 0;
        const currentBgFinal = isLeftFinal ? evenBg : oddBg;
        if (currentBgFinal) {
            await drawBackgroundImageWithBleed(pdf, currentBgFinal, pageWidth, pageHeight, pageSpec, customization);
        }
        if (customization?.showPageNumbers) {
            drawPageNumber(pdf, actualFinalPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftFinal);
        }
    }

    // 4. Outro Pages (Back Matter)
    if (customization?.backMatter && customization.backMatter.length > 0) {
        for (const bmPage of customization.backMatter) {
            pdf.addPage();
            const internalPageNum = pdf.getNumberOfPages();
            const bookPageNum = internalPageNum + (customization.frontMatterPageCount || 0);
            const isLeftPage = bookPageNum % 2 === 0;
            const currentBg = isLeftPage ? evenBg : oddBg;

            await addCustomFrontMatterPage(pdf, bmPage, currentBg, customization, pageWidth, pageHeight, pageSpec, isLeftPage, false);

            if (customization?.showPageNumbers) {
                const actualPageNum = internalPageNum + startPageNumber - 1;
                drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftPage);
            }
        }
    }

    const arrayBuffer = pdf.output('arraybuffer');

    if (customization?.flattenPdf) {
        return await flattenPDF(arrayBuffer, pageWidth, pageHeight, customization.highQualityPrint);
    }

    return arrayBuffer;
}

/**
 * Flattens a PDF by rendering each page to a high-resolution image and creating a new PDF.
 */
async function flattenPDF(
    pdfBuffer: ArrayBuffer,
    pageWidth: number,
    pageHeight: number,
    highQuality?: boolean
): Promise<ArrayBuffer> {
    const pdfjsModule = await import('pdfjs-dist');
    const pdfjs = (pdfjsModule as any).default || pdfjsModule;

    // Set worker src - use unpkg as it correctly serves version 5+ .mjs files
    // Fallback to legacy unpkg URL if version 5 mjs fails or matches older patterns
    const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const newPdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageWidth, pageHeight],
        compress: !highQuality,
    });

    const scale = highQuality ? 4 : 2; // 4x scale for ~300 DPI, 2x for ~150 DPI

    for (let i = 1; i <= numPages; i++) {
        if (i > 1) newPdf.addPage();

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        try {
            await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas: canvas
            }).promise;

            const imgData = canvas.toDataURL('image/jpeg', highQuality ? 0.95 : 0.85);
            newPdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, highQuality ? 'NONE' : 'FAST');
        } catch (error) {
            console.error('Error flattening page:', error);
            throw new Error(`Flatten failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return newPdf.output('arraybuffer');
}

function drawPageNumber(
    pdf: jsPDF,
    pageNum: number,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    customization?: PDFCustomization,
    overrideY?: number,
    explicitIsLeftPage?: boolean
) {
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const config = template.pageNumber;
    const { textStyle } = config;

    // 1. Determine Display String
    let pageNumDisplay = pageNum.toString();
    if (config.style === 'roman') {
        pageNumDisplay = toRoman(pageNum).toLowerCase();
    } else if (config.style === 'roman-caps') {
        pageNumDisplay = toRoman(pageNum);
    }

    let pageNumStr = pageNumDisplay;
    if (config.style === 'brackets') {
        pageNumStr = `[ ${pageNumDisplay} ]`;
    } else if (config.style === 'elegant-dash') {
        pageNumStr = `— ${pageNumDisplay} —`;
    } else if (config.style === 'capsule' || config.style === 'pill') {
        pageNumStr = `- ${pageNumDisplay} -`;
    }

    const internalPageNum = pdf.getNumberOfPages();
    // Correctly calculate isLeftPage by including programmatic front matter length
    const programmaticOffset = (customization?.frontMatter?.length || 0);
    const frontMatterOffset = (customization?.frontMatterPageCount || 0) + programmaticOffset;
    const isLeftPage = explicitIsLeftPage !== undefined
        ? explicitIsLeftPage
        : (internalPageNum + (customization?.frontMatterPageCount || 0)) % 2 === 0;

    const mirrored = getMirroredMargins(isLeftPage, pageSpec);

    // 2. Position logic
    let x = pageWidth / 2;
    let align: 'center' | 'left' | 'right' = 'center';

    if (config.position.includes('outer')) {
        if (isLeftPage) {
            x = mirrored.left;
            align = 'left';
        } else {
            x = mirrored.right;
            align = 'right';
        }
    }

    let y = overrideY !== undefined ? overrideY : 0;
    if (overrideY === undefined) {
        if (config.position.startsWith('bottom')) {
            // Place it closer to the content box bottom
            y = mirrored.bottom + 6;
        } else {
            // Place it closer to the content box top
            y = mirrored.top - 4;
        }
    }

    // 3. Typography & Color
    let fontName = 'helvetica';
    if (customization?.customFont) {
        fontName = 'CustomFont';
    } else {
        const family = (textStyle.fontFamily || 'helvetica').toLowerCase();
        if (family.includes('times') || family.includes('serif')) fontName = 'times';
        else if (family.includes('courier') || family.includes('mono')) fontName = 'courier';
    }

    // Use user-defined color or template default
    let strokeColor = customization?.pageNumberColor || textStyle.color || '#000000';
    const strokeRgb = hexToRgb(strokeColor);

    try {
        // Use normal for page numbers if using custom fonts, otherwise bold for standards
        const style = fontName === 'CustomFont' ? 'normal' : 'bold';
        safeSetFont(pdf, fontName, style);
    } catch (e) {
        pdf.setFont('helvetica', 'bold');
    }
    pdf.setFontSize(textStyle.fontSize || 10);

    // 4. Background Styles
    if (config.fillColor && config.fillColor !== 'transparent' && config.fillColor !== '#transparent') {
        const fillRgb = hexToRgb(config.fillColor);
        pdf.setFillColor(fillRgb.r, fillRgb.g, fillRgb.b);

        if (config.style === 'circle') {
            pdf.circle(x, y - 1, 5, 'F');
        } else if (config.style === 'box') {
            const padX = 4;
            const padY = 2;
            const tw = pdf.getTextWidth(pageNumStr);
            const th = (textStyle.fontSize || 10) * PT_TO_MM;
            pdf.rect(x - (tw / 2) - padX, y - th - padY, tw + (padX * 2), th + (padY * 2), 'F');
        } else if (config.style === 'modern-box') {
            const tw = pdf.getTextWidth(pageNumStr);
            const th = (textStyle.fontSize || 10) * PT_TO_MM;
            const pad = 3;
            pdf.rect(x - (tw / 2) - pad, y - th - pad, tw + (pad * 2), th + (pad * 2), 'F');
        } else if (config.style === 'capsule' || config.style === 'pill') {
            const padX = 6;
            const tw = pdf.getTextWidth(pageNumStr);
            const radius = 3.6;
            const bw = tw + (padX * 2) + 5;
            const bh = 8.0;
            const bx = x - (bw / 2);
            const by = y - 5.8;

            // 1. Background Fill
            pdf.roundedRect(bx, by, bw, bh, radius, radius, 'F');

            // 2. Double Thin Border (Parallel lines)
            pdf.setLineWidth(0.25);
            pdf.setDrawColor(strokeRgb.r, strokeRgb.g, strokeRgb.b);

            // Outer line
            pdf.roundedRect(bx, by, bw, bh, radius, radius, 'S');

            // Inner parallel line
            const offset = 0.5;
            pdf.roundedRect(bx + offset, by + offset, bw - (offset * 2), bh - (offset * 2), radius - 0.25, radius - 0.25, 'S');
        }
    } else if (config.style === 'capsule' || config.style === 'pill') {
        const padX = 6;
        const tw = pdf.getTextWidth(pageNumStr);
        const radius = 3.6;
        const bw = tw + (padX * 2) + 5;
        const bh = 8.0;
        const bx = x - (bw / 2);
        const by = y - 5.8;
        pdf.setLineWidth(0.25);
        pdf.setDrawColor(strokeRgb.r, strokeRgb.g, strokeRgb.b);
        pdf.roundedRect(bx, by, bw, bh, radius, radius, 'S');
        const offset = 0.5;
        pdf.roundedRect(bx + offset, by + offset, bw - (offset * 2), bh - (offset * 2), radius - 0.25, radius - 0.25, 'S');
    }

    // 5. Borders & Accents (Skip standard for capsule as handled above)
    if (config.style !== 'capsule' && config.style !== 'pill') {
        pdf.setDrawColor(strokeRgb.r, strokeRgb.g, strokeRgb.b);
        pdf.setLineWidth(0.3);

        if (config.style === 'circle' && (!config.fillColor || config.fillColor === 'transparent')) {
            pdf.circle(x, y - 1, 5, 'S');
        } else if (config.style === 'accent-bar') {
            const barW = Math.max(15, pdf.getTextWidth(pageNumStr) + 10);
            pdf.line(x - barW / 2, y + 2, x + barW / 2, y + 2);
        } else if (config.style === 'modern-box') {
            const tw = pdf.getTextWidth(pageNumStr);
            const th = (textStyle.fontSize || 10) * PT_TO_MM;
            const pad = 3;
            pdf.rect(x - (tw / 2) - pad, y - th - pad, tw + (pad * 2), th + (pad * 2), 'S');
        }
    }

    // 6. Draw Final Text
    pdf.setTextColor(strokeRgb.r, strokeRgb.g, strokeRgb.b);
    pdf.text(pageNumStr, x, y, { align: align as any });
}

async function drawBackgroundImageWithBleed(
    pdf: jsPDF,
    backgroundImage: string,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    customization?: PDFCustomization
) {
    try {
        const { dataUrl, width: imgWidth, height: imgHeight } = await loadImage(backgroundImage);

        const pageRatio = pageWidth / pageHeight;
        const imgRatio = imgWidth / imgHeight;

        let drawWidth, drawHeight, x, y;
        if (imgRatio > pageRatio) {
            drawHeight = pageHeight;
            drawWidth = pageHeight * imgRatio;
            x = (pageWidth - drawWidth) / 2;
            y = 0;
        } else {
            drawWidth = pageWidth;
            drawHeight = pageWidth / imgRatio;
            y = (pageHeight - drawHeight) / 2;
            x = 0;
        }

        // Draw image at computed bounds (fills bleed)
        pdf.addImage(dataUrl, 'PNG', x, y, drawWidth, drawHeight, undefined, customization?.highQualityPrint ? 'NONE' : 'FAST');
    } catch (error) {
        console.warn('Failed to load background image:', error);
        // Fallback to light gray background
        pdf.setFillColor(245, 245, 245);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }
}

/**
 * Draws a minimal line-art icon based on keywords
 */
function drawSmartIcon(pdf: jsPDF, x: number, y: number, size: number, title: string, color: string) {
    // Deprecated in favor of Material Symbols
    return;
}

/**
 * Helper to draw a line in segments, skipping parts that are inside excluded areas
 */
function drawSegmentedLine(pdf: jsPDF, x1: number, y1: number, x2: number, y2: number, checkExcluded: (x: number, y: number, buffer?: number) => boolean) {
    const step = 2.5; // Precision for line trimming
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(dist / step);

    let drawing = false;
    let startPoint = { x: x1, y: y1 };

    for (let i = 0; i <= steps; i++) {
        const t = Math.min(1, i / steps);
        const curX = x1 + dx * t;
        const curY = y1 + dy * t;

        const isExcluded = checkExcluded(curX, curY, 0.5); // Use tight buffer for line trimming

        if (!isExcluded && !drawing) {
            // Start a new segment
            startPoint = { x: curX, y: curY };
            drawing = true;
        } else if (isExcluded && drawing) {
            // End current segment
            pdf.line(startPoint.x, startPoint.y, curX, curY);
            drawing = false;
        }

        // Final segment closure
        if (i === steps && drawing) {
            pdf.line(startPoint.x, startPoint.y, curX, curY);
        }
    }
}

/**
 * Draws a seamless minimal pattern on the page
 */
function drawSeamlessPattern(pdf: jsPDF, w: number, h: number, type: string, color: string, title?: string, excludeAreas: { x: number, y: number, w: number, h: number }[] = [], words: string[] = [], customization?: PDFCustomization) {
    if (type === 'none') return;
    const rgb = hexToRgb(color);

    // Dynamic Opacity based on pattern type
    let opacity = 0.15;
    if (['dots', 'polka-dots', 'dashed-grid'].includes(type)) opacity = 0.18;
    if (['islamic', 'flowers', 'stars', 'confetti', 'modern-abstract'].includes(type)) opacity = 0.14;

    // Override with user customization if provided
    if (customization?.seamlessPatternOpacity !== undefined) {
        opacity = customization.seamlessPatternOpacity;
    }

    const gState = new (pdf as any).GState({ opacity });
    pdf.setGState(gState);

    // Initial Font setup - helps ensure it's loaded
    const hasIcons = ['icons', 'flowers', 'stars', 'zen-garden', 'random-icons-clean', 'random-letters-icons', 'random-micro-grid', 'random-diagonal-flow', 'random-dot-icon', 'premium-minimal', 'random-clusters', 'random-horizontal-drift', 'random-vertical-cascade', 'random-negative-blocks', 'random-icon-pairs', 'random-micro-noise', 'random-offset-waves', 'random-large-anchors', 'random-check-rhythm'].includes(type);
    if (hasIcons) {
        try {
            pdf.setFont('MaterialSymbols', 'normal');
        } catch (e) {
            // Fallback font if not loaded
            pdf.setFont('helvetica', 'normal');
        }
    }

    pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.setLineWidth(0.15);

    const checkExcluded = (x: number, y: number, buffer = 2) => {
        return excludeAreas.some(area =>
            x > area.x - buffer && x < area.x + area.w + buffer &&
            y > area.y - buffer && y < area.y + area.h + buffer
        );
    };

    const step = 20;

    if (type === 'dots') {
        for (let x = -5; x < w + 5; x += 15) {
            for (let y = -5; y < h + 5; y += 15) {
                if (!checkExcluded(x, y)) {
                    pdf.circle(x, y, 0.25, 'F');
                }
            }
        }
    } else if (type === 'polka-dots') {
        for (let x = -10; x < w + 10; x += 25) {
            for (let y = -10; y < h + 10; y += 25) {
                const xOff = (Math.floor(y / 25) % 2 === 0) ? 0 : 12.5;
                const px = x + xOff;
                if (!checkExcluded(px, y, 1)) {
                    pdf.circle(px, y, Math.random() > 0.5 ? 1.2 : 0.8, 'F');
                }
            }
        }
    } else if (type === 'grid' || type === 'dashed-grid') {
        const isDashed = type === 'dashed-grid';
        if (isDashed) pdf.setLineDashPattern([1, 2], 0);

        for (let x = 0; x <= w; x += 20) {
            drawSegmentedLine(pdf, x, 0, x, h, checkExcluded);
        }
        for (let y = 0; y <= h; y += 20) {
            drawSegmentedLine(pdf, 0, y, w, y, checkExcluded);
        }
        pdf.setLineDashPattern([], 0); // Reset
    } else if (type === 'diagonal') {
        for (let i = -h; i < w + h; i += 15) {
            drawSegmentedLine(pdf, i, 0, i + h, h, checkExcluded);
        }
    } else if (type === 'waves') {
        for (let y = -10; y < h + 10; y += 12) {
            for (let x = 0; x < w; x += 8) {
                if (!checkExcluded(x + 4, y, 1)) {
                    pdf.moveTo(x, y);
                    pdf.curveTo(x + 2, y - 1.5, x + 6, y + 1.5, x + 8, y);
                    pdf.stroke();
                }
            }
        }
    } else if (type === 'islamic') {
        const iStep = 25;
        pdf.setLineWidth(0.12);
        for (let x = -iStep; x < w + iStep; x += iStep) {
            for (let y = -iStep; y < h + iStep; y += iStep) {
                const px = x + (Math.floor(y / iStep) % 2 === 0 ? 0 : iStep / 2);
                if (!checkExcluded(px, y, 8)) {
                    // Refined 8-pointed star
                    const r1 = 6;
                    const r2 = 3.5;
                    pdf.moveTo(px + r1, y);
                    for (let i = 1; i <= 16; i++) {
                        const r = i % 2 === 0 ? r1 : r2;
                        const a = i * Math.PI / 8;
                        pdf.lineTo(px + r * Math.cos(a), y + r * Math.sin(a));
                    }
                    pdf.close();
                    pdf.stroke();

                    // Modern center motif
                    pdf.circle(px, y, 0.8, 'F');
                }
            }
        }
    } else if (type === 'flowers') {
        // Verified Material Symbols Unicodes for Flowers
        const flowerIcons = ['\ue545', '\uf83e', '\ue3e7', '\ueb4c', '\uf021'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.8 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 100; i++) {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            if (!checkExcluded(rx, ry, 6)) {
                const icon = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
                pdf.setFontSize(10 + Math.random() * 12);
                pdf.text(icon, rx, ry, { angle: Math.random() * 360 });
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'modern-abstract') {
        const stepSize = 35;
        for (let x = -20; x < w + 20; x += stepSize) {
            for (let y = -20; y < h + 20; y += stepSize) {
                const px = x + Math.random() * 20;
                const py = y + Math.random() * 20;
                if (!checkExcluded(px, py, 12)) {
                    pdf.saveGraphicsState();
                    const mode = Math.random();
                    if (mode < 0.25) {
                        pdf.setLineWidth(0.3);
                        pdf.circle(px, py, 4 + Math.random() * 6, 'S');
                    } else if (mode < 0.5) {
                        pdf.saveGraphicsState();
                        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.7 }));
                        pdf.roundedRect(px, py, 10, 5, 2, 2, 'F');
                        pdf.restoreGraphicsState();
                    } else if (mode < 0.75) {
                        pdf.setLineWidth(0.5);
                        pdf.moveTo(px, py);
                        pdf.curveTo(px + 4, py - 6, px + 8, py + 6, px + 12, py);
                        pdf.stroke();
                    } else {
                        // Small cluster of 3 dots
                        for (let k = 0; k < 3; k++) {
                            pdf.circle(px + k * 3, py + (k % 2) * 2, 0.6, 'F');
                        }
                    }
                    pdf.restoreGraphicsState();
                }
            }
        }
    } else if (type === 'stars') {
        const starIcons = ['\ue838', '\ue83a', '\ue65f', '\ueb46']; // various stars/sparkles
        pdf.saveGraphicsState();
        pdf.setFont('MaterialSymbols', 'normal');
        for (let x = -10; x < w + 10; x += 18) {
            for (let y = -10; y < h + 10; y += 18) {
                const px = x + (Math.random() - 0.5) * 12;
                const py = y + (Math.random() - 0.5) * 12;
                if (!checkExcluded(px, py, 2)) {
                    pdf.setFontSize(4 + Math.random() * 6);
                    const icon = starIcons[Math.floor(Math.random() * starIcons.length)];
                    pdf.text(icon, px, py);

                    if (Math.random() > 0.8) { // Occasional tiny connections
                        pdf.setLineWidth(0.05);
                        pdf.line(px, py, px + 15, py + 5);
                        pdf.setLineWidth(0.15);
                    }
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'circles') {
        for (let x = -10; x < w + 10; x += step) {
            for (let y = -10; y < h + 10; y += step) {
                if (!checkExcluded(x, y) && Math.random() > 0.45) {
                    pdf.circle(x, y, 1.5 + Math.random() * 3, 'S');
                }
            }
        }
    } else if (type === 'diamonds') {
        const dStep = 18;
        for (let x = -dStep; x < w + dStep; x += dStep) {
            for (let y = -dStep; y < h + dStep; y += dStep) {
                const px = x + (Math.floor(y / dStep) % 2 === 0 ? 0 : dStep / 2);
                if (!checkExcluded(px, y, dStep / 3 + 1)) {
                    pdf.moveTo(px, y - dStep / 3);
                    pdf.lineTo(px + dStep / 3, y);
                    pdf.lineTo(px, y + dStep / 3);
                    pdf.lineTo(px - dStep / 3, y);
                    pdf.lineTo(px, y - dStep / 3);
                    pdf.stroke();
                }
            }
        }
    } else if (type === 'triangles') {
        const tSize = 8;
        for (let x = -tSize; x < w + tSize; x += 15) {
            for (let y = -tSize; y < h + tSize; y += 15) {
                if (!checkExcluded(x, y, tSize / 2 + 1)) {
                    pdf.moveTo(x, y - tSize / 2);
                    pdf.lineTo(x + tSize / 2, y + tSize / 2);
                    pdf.lineTo(x - tSize / 2, y + tSize / 2);
                    pdf.close();
                    pdf.stroke();
                }
            }
        }
    } else if (type === 'chevron') {
        pdf.setLineWidth(0.25);
        for (let y = -5; y < h + 10; y += 12) {
            for (let x = -10; x < w + 10; x += 15) {
                if (!checkExcluded(x + 7.5, y + 2, 1)) {
                    pdf.moveTo(x, y);
                    pdf.lineTo(x + 7.5, y + 5);
                    pdf.lineTo(x + 15, y);
                    pdf.stroke();
                }
            }
        }
    } else if (type === 'crosses') {
        const cSize = 3;
        for (let x = -10; x < w + 10; x += 15) {
            for (let y = -10; y < h + 10; y += 15) {
                const px = x + (Math.floor(y / 15) % 2 === 0 ? 0 : 7.5) + (Math.random() - 0.5) * 3;
                const py = y + (Math.random() - 0.5) * 3;
                if (!checkExcluded(px, py, 1)) {
                    pdf.setLineWidth(0.15 + (Math.random() * 0.1));
                    pdf.line(px - cSize / 2, py, px + cSize / 2, py);
                    pdf.line(px, py - cSize / 2, px, py + cSize / 2);
                }
            }
        }
    } else if (type === 'confetti') {
        for (let x = -10; x < w + 10; x += 12) {
            for (let y = -10; y < h + 10; y += 12) {
                if (Math.random() > 0.4) continue; // Sparse coverage
                const px = x + Math.random() * 12;
                const py = y + Math.random() * 12;
                if (!checkExcluded(px, py, 1)) {
                    const shape = Math.random();
                    const size = 1.2 + Math.random() * 1.8;
                    if (shape < 0.4) {
                        pdf.circle(px, py, size / 2, 'F');
                    } else if (shape < 0.7) {
                        pdf.rect(px, py, size, size * 0.6, 'F');
                    } else {
                        pdf.setLineWidth(0.35);
                        const angle = Math.random() * Math.PI;
                        pdf.line(px, py, px + size * Math.cos(angle), py + size * Math.sin(angle));
                        pdf.setLineWidth(0.15);
                    }
                }
            }
        }
    } else if (type === 'zen-garden') {
        // Sand ripples + stones
        pdf.setLineWidth(0.3);
        for (let y = 0; y < h; y += 8) {
            for (let x = 0; x < w; x += 10) {
                if (!checkExcluded(x, y, 5)) {
                    pdf.moveTo(x, y);
                    pdf.curveTo(x + 3, y - 2, x + 7, y + 2, x + 10, y);
                    pdf.stroke();
                }
            }
        }
    } else if (type === 'random-icons-clean') {
        const icons = ['\ue8b6', '\ue3ec', '\ue8a1', '\ue745'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.7 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 8)) {
                pdf.setFontSize(10 + Math.random() * 6);
                pdf.text(
                    icons[Math.floor(Math.random() * icons.length)],
                    x, y,
                    { angle: Math.random() > 0.85 ? 90 : 0 }
                );
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-letters-icons') {
        const icons = ['\ue8b6', '\ue3ec'];
        const letters = ['A', 'E', 'L', 'S', 'T'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.6 }));
        for (let i = 0; i < 140; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 8)) {
                if (Math.random() < 0.4) {
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(9);
                    pdf.text(letters[Math.floor(Math.random() * letters.length)], x, y);
                } else {
                    pdf.setFont('MaterialSymbols', 'normal');
                    pdf.setFontSize(11);
                    pdf.text(
                        icons[Math.floor(Math.random() * icons.length)],
                        x, y,
                        { angle: Math.random() > 0.9 ? 90 : 0 }
                    );
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-micro-grid') {
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.5 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 90; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 10)) {
                pdf.setFontSize(14);
                pdf.text('\ue3ec', x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-diagonal-flow') {
        const icons = ['\ue8b6', '\ue8a1', '\ue745'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.6 }));
        pdf.setFont('MaterialSymbols', 'normal');
        let offset = Math.random() * 40;
        for (let y = -40; y < h + 40; y += 40) {
            for (let x = -40; x < w + 40; x += 80) {
                const px = x + offset;
                const py = y + offset;
                if (!checkExcluded(px, py, 10)) {
                    pdf.setFontSize(12);
                    pdf.text(
                        icons[Math.floor(Math.random() * icons.length)],
                        px, py,
                        { angle: 45 }
                    );
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-dot-icon') {
        const icon = '\ue8b6';
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.5 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 180; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 6)) {
                if (Math.random() < 0.7) {
                    pdf.circle(x, y, 0.6, 'F');
                } else {
                    pdf.setFontSize(10);
                    pdf.text(icon, x, y);
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'premium-minimal') {
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.4 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 14)) {
                pdf.setFontSize(16);
                pdf.text('\ue3ec', x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-clusters') {
        const icons = ['\ue8b6', '\ue3ec', '\ue8a1'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.6 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let c = 0; c < 18; c++) {
            const cx = Math.random() * w;
            const cy = Math.random() * h;
            for (let i = 0; i < 6; i++) {
                const x = cx + (Math.random() * 20 - 10);
                const y = cy + (Math.random() * 20 - 10);
                if (!checkExcluded(x, y, 8)) {
                    pdf.setFontSize(10 + Math.random() * 4);
                    pdf.text(icons[Math.floor(Math.random() * icons.length)], x, y);
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-horizontal-drift') {
        const icons = ['\ue3ec', '\ue745'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.55 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let y = 20; y < h; y += 36) {
            for (let x = -40; x < w + 40; x += 80) {
                const px = x + Math.random() * 20;
                if (!checkExcluded(px, y, 8)) {
                    pdf.setFontSize(12);
                    pdf.text(icons[Math.floor(Math.random() * icons.length)], px, y);
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-vertical-cascade') {
        const icon = '\ue8b6';
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.5 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let x = 24; x < w; x += 48) {
            for (let y = -30; y < h + 30; y += 60) {
                const py = y + Math.random() * 20;
                if (!checkExcluded(x, py, 10)) {
                    pdf.setFontSize(11);
                    pdf.text(icon, x, py);
                }
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-negative-blocks') {
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.45 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 70; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 16)) {
                pdf.setFontSize(18);
                pdf.text('\ue3ec', x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-letter-cloud') {
        const letters = ['A', 'E', 'I', 'O', 'U', 'S', 'T', 'L'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.55 }));
        pdf.setFont('helvetica', 'normal');
        for (let i = 0; i < 160; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 6)) {
                pdf.setFontSize(8 + Math.random() * 4);
                pdf.text(letters[Math.floor(Math.random() * letters.length)], x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-icon-pairs') {
        const icons = ['\ue8b6', '\ue3ec'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.6 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 10)) {
                pdf.setFontSize(11);
                pdf.text(icons[0], x, y);
                pdf.text(icons[1], x + 10, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-micro-noise') {
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.4 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 240; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 4)) {
                pdf.setFontSize(6);
                pdf.text('\ue3ec', x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-offset-waves') {
        const icon = '\ue745';
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.55 }));
        pdf.setFont('MaterialSymbols', 'normal');
        let offset = Math.random() * 20;
        for (let y = 30; y < h; y += 40) {
            for (let x = -30; x < w + 30; x += 70) {
                const px = x + offset;
                if (!checkExcluded(px, y, 8)) {
                    pdf.setFontSize(12);
                    pdf.text(icon, px, y);
                }
            }
            offset = -offset;
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-large-anchors') {
        const icons = ['\ue8a1', '\ue8b6'];
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.35 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 36; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 20)) {
                pdf.setFontSize(22);
                pdf.text(icons[Math.floor(Math.random() * icons.length)], x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'random-check-rhythm') {
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.6 }));
        pdf.setFont('MaterialSymbols', 'normal');
        for (let i = 0; i < 140; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            if (!checkExcluded(x, y, 8)) {
                pdf.setFontSize(10);
                pdf.text('\ue876', x, y);
            }
        }
        pdf.restoreGraphicsState();
    } else if (type === 'icons' && title) {
        drawIconBackground(pdf, w, h, title, color, excludeAreas, words, opacity);
    }

    // Reset GState
    const resetGState = new (pdf as any).GState({ opacity: 1.0 });
    pdf.setGState(resetGState);
}

/**
 * Draws a random scattered icon background outside the content box using Material Symbols
 */
function drawIconBackground(pdf: jsPDF, w: number, h: number, title: string, color: string, excludeAreas: { x: number, y: number, w: number, h: number }[] = [], words: string[] = [], opacity: number = 0.15) {
    const textContext = (title + " " + words.join(" ")).toLowerCase();

    // 1. Theme Configuration with Material Symbols Unicode
    let primaryIcons: string[] = [];
    let fillerIcons: string[] = ['\ue87d', '\ue838', '\ue310', '\ue65f', '\ue15b', '\ue019']; // heart, star, bubble, sparkles, dots, tiny_circle

    const themes: { keywords: RegExp, icons: string[] }[] = [
        { keywords: /nature|forest|tree|leaf|flower|garden|earth|green|wood|mountain|park|botanic|grass|plant|jungle|bush|root/, icons: ['\uefd8', '\uea61', '\uea41', '\ue891', '\uea35', '\ue24b', '\ue430', '\ue2bd', '\ueb94', '\uea33'] },
        { keywords: /space|moon|star|planet|galaxy|sky|night|astro|cosmic|universe|rocket|nasa|alien|ufo|comet|orbit|saturn/, icons: ['\ue838', '\ue3a6', '\ueba5', '\ue80b', '\ue3e7', '\uf059', '\ue430', '\ue93c', '\ue93b'] },
        { keywords: /sea|ocean|beach|water|fish|marine|ship|boat|island|wave|underwater|shark|whale|dolphin|turtle|shell|coral|anchor|shore|sand/, icons: ['\ue769', '\ue92c', '\ue1cd', '\ueb4a', '\ue175', '\ueba3', '\ueb34', '\ueb3a', '\ue92b', '\uea40'] },
        { keywords: /school|book|study|learn|science|history|pencil|math|class|teacher|lab|read|write|college|university|exam|grade/, icons: ['\uea19', '\ue3c9', '\ue8b0', '\uf0af', '\ue53f', '\uea3e', '\uea5f', '\ue85e', '\ue90c', '\ue86d'] },
        { keywords: /food|fruit|apple|pizza|sweet|cake|candy|drink|chef|kitchen|berry|cookie|burger|coffee|tea|bread|honey|egg/, icons: ['\ue56c', '\ue552', '\uea0b', '\uea1b', '\ue54a', '\ufc31', '\uea61', '\ue541', '\ue544', '\ue532'] },
        { keywords: /animal|pet|dog|cat|bird|bunny|lion|tiger|zoo|safari|farm|horse|cow|sheep|pig|paws|wild|zoo/, icons: ['\ue91d', '\ueb99', '\ue868', '\ue00b', '\ue50c', '\ue891', '\uea35', '\uea4a', '\uea3d'] },
        { keywords: /sport|game|play|soccer|basketball|tennis|puzzle|run|jump|golf|baseball|winning|trophy|race|gym/, icons: ['\uea2f', '\uea26', '\uea31', '\ue332', '\ue87b', '\uea68', '\ue811', '\uea1e', '\ue8d3', '\ue51e'] },
        { keywords: /weather|rain|snow|storm|wind|cloud|sun|hot|cold|winter|summer|fall|spring|ice|thunder/, icons: ['\ue430', '\ue2bd', '\ue818', '\ueb3b', '\ueb3e', '\ue2c0', '\uebe1', '\uebe3', '\ue2c4', '\ue1ad'] },
        { keywords: /music|song|sing|dance|guitar|piano|drum|sound|radio|note|concert|audio|jazz/, icons: ['\ue405', '\ue030', '\ue41a', '\ue03e', '\ue03d', '\ue811', '\ue019', '\ue3a0', '\ue411', '\uea3a'] },
        { keywords: /travel|trip|car|plane|map|tour|world|city|road|vacation|hotel|luggage|train|bus|bicycle/, icons: ['\ue531', '\ue53d', '\ue55b', '\ue8b4', '\ue7f1', '\ue530', '\ue532', '\ue80b', '\ue195', '\ue52f'] },
        { keywords: /home|house|key|tools|build|hammer|fix|room|bed|chair|clean|clock|lamp/, icons: ['\ue88a', '\ue0b7', '\ue869', '\ue8ad', '\ue14f', '\ue244', '\ue91c', '\ue834', '\ue312', '\ue1b1'] },
        { keywords: /tech|computer|code|phone|camera|video|web|online|battery|cloud|mouse/, icons: ['\ue30a', '\ue325', '\ue86f', '\ue3af', '\ue04b', '\ue80b', '\ue1af', '\ue245', '\ue3e1', '\ue32c'] },
        { keywords: /fashion|clothes|shirt|shoe|bag|diamond|jewelry|dress|style|makeup/, icons: ['\ue8d1', '\ue848', '\ue942', '\uea44', '\ue819', '\ueb65', '\ueb64', '\ue14d', '\ue3d6', '\ue40b'] },
        { keywords: /holiday|christmas|party|gift|birthday|halloween|celebrate|festive/, icons: ['\ue8f6', '\uea68', '\ue65f', '\ue811', '\uea0b', '\ue838', '\uea61', '\ue818', '\ue430', '\uea2c'] },
        { keywords: /medical|doctor|hospital|nurse|health|body|heart|medicine|pill|first_aid|dentist/, icons: ['\ue87d', '\ueb3c', '\ue507', '\ue934', '\uea3f', '\ue8f2', '\uf04e', '\uf045', '\uea37', '\ue1ad'] },
        { keywords: /art|paint|color|draw|design|brush|palette|creative|museum|gallery|craft|sketch/, icons: ['\ue40a', '\ue3ae', '\uf032', '\ue3b8', '\ue413', '\ue40b', '\ue412', '\ue244', '\ue14f', '\ue401'] },
        { keywords: /money|finance|cash|bank|business|chart|graph|dollar|coins|wallet|rich|buy|sell/, icons: ['\ue263', '\ue850', '\ue8d1', '\uea4a', '\ueaf1', '\ue8f5', '\ue84f', '\ue227', '\ue8d2', '\ueb3f'] },
        { keywords: /talk|call|chat|message|mail|phone|social|email|news|speech|video/, icons: ['\ue0b0', '\ue0c9', '\ue158', '\ue0d0', '\ue0d4', '\ue0e1', '\ue8af', '\ue001', '\ue8fd', '\ueaf0'] },
        { keywords: /science|lab|chemistry|atom|physics|biology|test_tube|microscope|dna|experiment/, icons: ['\uea19', '\ue8b0', '\uea4b', '\uea4c', '\uf0af', '\uea1a', '\uea3f', '\ueb4b', '\uea37', '\ue90b'] },
        { keywords: /tools|hardware|hammer|wrench|screwdriver|fix|build|construction|safety|worker/, icons: ['\ue869', '\ue8ad', '\ue14f', '\ue244', '\ue24b', '\ue88a', '\ue3a2', '\ue907', '\ue906', '\ue854'] },
        { keywords: /magic|fantasy|wizard|dragon|castle|sword|myth|mystery|fairytale|ghost|monster/, icons: ['\ue818', '\ue838', '\uea2c', '\ue02b', '\ue7f1', '\ue819', '\uea19', '\uea2c', '\ue818', '\ue65f'] },
        { keywords: /emotion|feel|happy|sad|smile|angry|laugh|cry|surprised|face|emoji/, icons: ['\ue811', '\ue812', '\ue813', '\ue814', '\ue815', '\uea61', '\ue811', '\uea1e', '\ue24b', '\ue811'] },
        { keywords: /military|war|army|soldier|tank|shield|sword|battle|history|victory|peace/, icons: ['\uf044', '\ue1b4', '\ue1b3', '\ue32a', '\uf0af', '\ue8d2', '\ue302', '\uee42', '\uea2c', '\ue190'] },
        { keywords: /family|people|parent|child|man|woman|baby|group|community|heart|love/, icons: ['\ue7ef', '\uea21', '\uea15', '\ue42e', '\ue811', '\ue87d', '\uea1f', '\uea20', '\ue7fb', '\ue14d'] },
        { keywords: /religion|spiritual|church|pray|cross|mosque|peace|zen|meditate|soul/, icons: ['\ueac9', '\ue7b4', '\ue811', '\ue87d', '\uf03f', '\uebae', '\ue0c6', '\ue80b', '\ue818', '\uea3e'] },
        { keywords: /eco|environment|recycle|clean|earth|world|plant|nature|energy|leaf/, icons: ['\ue8b4', '\ue933', '\ue92f', '\uea33', '\ue894', '\ue894', '\uea35', '\uea3d', '\ue430', '\ue93a'] },
        { keywords: /law|justice|judge|court|legal|police|badge|shield|hammer|gavel|right/, icons: ['\uea52', '\uf024', '\ue86a', '\ue1b4', '\ue8b0', '\ue8af', '\uea19', '\ue87d', '\ue32a', '\uf0af'] },
        { keywords: /architecture|building|city|skyscraper|design|blueprint|construction|statue/, icons: ['\ue7f1', '\uea3b', '\ue14c', '\uea3c', '\ue190', '\uea4c', '\uea3a', '\ue88a', '\uea1a', '\ue3a2'] },
        { keywords: /automotive|car|engine|tire|drive|road|garage|repair|speed|race/, icons: ['\ue530', '\ue531', '\ue869', '\ue8d2', '\ue195', '\ue52f', '\ue532', '\ue55b', '\ue8b4', '\ue131'] },
        { keywords: /beauty|makeup|hair|style|spa|relax|flower|mirror|skin|fashion/, icons: ['\ue14d', '\ueb65', '\ueb64', '\uea44', '\ue891', '\uea35', '\ue412', '\ue942', '\ue819', '\ue3d6'] },
        { keywords: /kids|baby|toy|child|doll|train|block|play|game|nursery|cradle/, icons: ['\ue332', '\uea1f', '\uea20', '\uea21', '\ue14c', '\ue14d', '\ue81b', '\uea30', '\uea2f', '\ueb99', '\uea26'] },
        { keywords: /geometry|math|maths|shape|form|circle|square|triangle|angle|line|calcul/, icons: ['\uea5c', '\uea1e', '\uea3a', '\ue3c4', '\uea34', '\ueaff', '\uea1d', '\uea5c', '\uea5f', '\ue8cd'] },
        { keywords: /geography|map|globe|world|country|city|continent|land|mountain|valley/, icons: ['\ue55b', '\ue80b', '\ue8b4', '\ue55c', '\uea3b', '\ue902', '\ue3e6', '\ue562', '\ue190', '\ue52e'] },
        { keywords: /hobby|photography|fishing|gardening|camping|hiking|sewing|craft/, icons: ['\ue412', '\ue43a', '\ue24b', '\uea30', '\uea1b', '\uea2c', '\ue3af', '\ue176', '\ue88a', '\ue3e8'] },
        { keywords: /winter|ice|cold|snow|freeze|frost|penguin|polar|glacier|igloo/, icons: ['\ue2c0', '\uebe3', '\ue93a', '\uebe1', '\uebe1', '\ue2ac', '\uea4c', '\uebe1', '\ue2bd', '\ue2c0'] },
        { keywords: /summer|heat|sun|vacation|palm|beach|swim|hot|dry/, icons: ['\ue430', '\ueb4a', '\ue92b', '\ue175', '\ue3e7', '\ue175', '\ueb3b', '\ue430', '\uea40', '\ueb34'] },
        { keywords: /drink|coffee|tea|wine|beer|juice|cocktail|water|soda|bar/, icons: ['\ue541', '\ue544', '\ue536', '\ue540', '\ue7f3', '\uea1b', '\ue175', '\ue540', '\ue541', '\ue541'] },
        { keywords: /history|ancient|museum|old|past|civilization|archaeology|castle/, icons: ['\ue85e', '\ue8d2', '\ue7f1', '\ue819', '\uea52', '\uf024', '\uea19', '\uea3a', '\ue88a', '\ue8b0'] },
        { keywords: /agriculture|farm|crop|harvest|farmer|tractor|soil|seed|grow/, icons: ['\uea34', '\uea41', '\ue24b', '\ueb34', '\uefd8', '\ue1cd', '\ue176', '\uea35', '\ue891', '\ue430'] },
        { keywords: /insect|bug|bee|ant|spider|butterfly|fly|mosquito|beetle|hive/, icons: ['\ue868', '\uea1e', '\uea34', '\uefd8', '\uefd8', '\ue868', '\ue868', '\ue1b1', '\uea41', '\ue868'] },
        { keywords: /movie|cinema|film|theatre|popcorn|actor|screen|drama|comedy|action/, icons: ['\ue40b', '\ue02c', '\ue02b', '\ue40b', '\ue8f5', '\ue02d', '\ue02d', '\ue031', '\ue40b', '\ue02d'] },
        { keywords: /literature|poetry|write|read|author|poem|ink|quill|script|journal/, icons: ['\uea19', '\ue3c9', '\uea3e', '\ue86d', '\uea1d', '\uea19', '\uea3e', '\ue3c9', '\ue8b0', '\ue3b8'] },
        { keywords: /electronics|gadget|robot|chip|circuit|power|battery|voltage|electric/, icons: ['\ue32c', '\ue3af', '\ue325', '\ue30a', '\ue1af', '\ue19b', '\ue245', '\ue3e1', '\ue1a7', '\ue32c'] },
        { keywords: /geology|rock|gem|crystal|mineral|stone|cave|volcano|earth/, icons: ['\ue942', '\ueb36', '\uefd8', '\uefd8', '\ueb94', '\ue942', '\ue1ad', '\ue175', '\uefd8', '\uefd8'] },
        { keywords: /social|web|chat|friend|profile|follow|like|comment|share|network/, icons: ['\ue7fb', '\ue7fb', '\ue0c9', '\ue87d', '\ue8af', '\ue80d', '\ue158', '\ue853', '\ue7ef', '\ue80b'] },
        { keywords: /furniture|interior|decor|home|room|sofa|table|chair|lamp|rug/, icons: ['\ue1b1', '\ue312', '\ue834', '\ue88a', '\ue91c', '\ue244', '\ue14f', '\ue16b', '\ue3d6', '\ue1b1'] },
        { keywords: /cleaning|chore|laundry|wash|soap|brush|tidy|clean|dust/, icons: ['\ue91c', '\uea3f', '\ue894', '\ue8ad', '\ue894', '\ue1af', '\ue8ad', '\ue244', '\ue14f', '\ue8ad'] },
        { keywords: /shopping|ecommerce|cart|buy|sale|deal|market|discount|price/, icons: ['\ue8cc', '\ue8cc', '\ue8d1', '\ue8cb', '\ue8f5', '\uea4a', '\ueaf1', '\ue8b0', '\ue850', '\ue8cc'] },
        { keywords: /security|lock|shield|safe|password|guard|privacy|protect|camera/, icons: ['\ue897', '\ue32a', '\ue898', '\ue83d', '\uef43', '\ue83d', '\ue413', '\ue899', '\ue53f', '\ue32c'] },
        { keywords: /time|clock|date|hour|future|past|calendar|alarm|watch|timer/, icons: ['\ue192', '\ue916', '\ue855', '\ue190', '\ue425', '\ue192', '\ue8b5', '\ue425', '\ue191', '\uea3b'] },
        { keywords: /mythology|god|goddess|legend|titan|olympus|spirit|holy|divine/, icons: ['\uea19', '\uea3a', '\ueac9', '\ue7b4', '\ue811', '\uea3e', '\uea35', '\ue818', '\uea2c', '\ueac9'] },
        { keywords: /birds|owl|eagle|hawk|parrot|avian|wing|feather|nest|flight/, icons: ['\ue00b', '\uea3e', '\ue531', '\ue53d', '\uea4c', '\ue00b', '\uea3e', '\ue00b', '\ue531', '\uea4c'] },
        { keywords: /geology|volcano|lava|magma|tectonic|earthquake|seismic|rock|stone/, icons: ['\ueb94', '\ue176', '\ueb3b', '\uefd8', '\uea3b', '\ueb94', '\ueb3e', '\uefd8', '\ue175', '\uefd8'] },
        { keywords: /diy|craft|tools|glue|tape|scissors|measuring|level|project/, icons: ['\ue869', '\ue14f', '\ue244', '\ue3c4', '\ueaff', '\uea1d', '\ue8ad', '\ue854', '\uea3b', '\uea1a'] },
        { keywords: /aerospace|plane|pilot|airport|flight|sky|cloud|wing|rocket|satellite/, icons: ['\ue195', '\ue531', '\ue3a0', '\ue53d', '\uf024', '\uea1a', '\ue2bd', '\ue539', '\ue531', '\ue195'] },
        { keywords: /botany|plant|flower|root|seed|growth|green|nature|garden|herbal/, icons: ['\uea35', '\uea41', '\uea33', '\ue891', '\ue24b', '\uea35', '\ufc32', '\ue891', '\ufc32', '\ue891'] },
        { keywords: /marine|biology|sub|plankton|whale|shark|dolphin|coral|reef|tide/, icons: ['\ue1d8', '\ue1cd', '\ue769', '\ue92c', '\ueba3', '\ue769', '\ueb4a', '\ueb3a', '\ue92b', '\ue1d8'] },
        { keywords: /carpentry|wood|hammer|saw|drill|nail|building|craft|timber/, icons: ['\uea34', '\ue3a2', '\ue907', '\ue906', '\ue869', '\ue854', '\uea3b', '\uea1f', '\ue1b1', '\uea34'] },
        { keywords: /photography|lens|shutter|flash|camera|photo|memory|viewfinder/, icons: ['\ue3af', '\ue412', '\ue30a', '\ue332', '\ue413', '\ue3af', '\ue3af', '\ue412', '\ue43a', '\ue3b8'] },
        { keywords: /nutrition|health|vitamin|fruit|veg|scale|fitness|diet|balanced/, icons: ['\uea61', '\ue56c', '\uea1b', '\ue54a', '\uea0b', '\uea3f', '\ue8b0', '\ue541', '\uea3d', '\uea61'] },
        { keywords: /automation|robot|ai|chip|circuit|code|modern|fast|future/, icons: ['\ue32c', '\ue3af', '\ue325', '\ue30a', '\ue1af', '\ue245', '\ue3e1', '\ue32c', '\ue30a', '\ue3af'] },
        { keywords: /mining|gold|diamond|pickaxe|rock|gem|quarry|deep|mineral/, icons: ['\ue942', '\ue8d1', '\uefd8', '\ue1cd', '\uefd8', '\uefd8', '\uefd8', '\uefd8', '\ue1cd', '\uefd8'] },
        { keywords: /fantasy|myth|fairytale|castle|magic|wizard|dragon|knight|sword/, icons: ['\ue818', '\ue838', '\uea2c', '\ue7f1', '\ue819', '\ue32a', '\ue190', '\uea19', '\uea3a'] },
        { keywords: /egypt|pyramid|ancient|archaeology|museum|history|pharaoh/, icons: ['\uea3b', '\uea4c', '\ue85e', '\uea19', '\ue8d2', '\ue7f1', '\ue819', '\uea52', '\uf024'] },
        { keywords: /camping|hiking|outdoor|tent|fire|mountain|climb|adventure/, icons: ['\ue3e8', '\ue53e', '\ue190', '\uea3b', '\ue536', '\ue32c', '\uea3a', '\ue562', '\ue55c'] },
        { keywords: /chess|board|game|play|strategy|dice|card|casino|puzzle/, icons: ['\uea2f', '\uea26', '\uea30', '\uea1f', '\uea20', '\uea21', '\ue332', '\uea68', '\ue811'] },
        { keywords: /winter|arctic|polar|cold|snow|ice|freeze|penguin|bear/, icons: ['\ue2c0', '\uebe3', '\ue93a', '\uebe1', '\ue2ac', '\uea4c', '\ue2bd', '\uebe1', '\ue2c0'] },
        { keywords: /autumn|fall|leaf|harvest|brown|orange|pumpkin|thanksgiving/, icons: ['\uea35', '\uea41', '\uefd8', '\ue1cd', '\uefd8', '\uea33', '\ue891', '\ue24b', '\ue430'] },
        { keywords: /spring|flower|bloom|garden|green|butterfly|bee|bird|rain/, icons: ['\ue430', '\ue2bd', '\ue891', '\uea35', '\uea41', '\uefd8', '\ue868', '\ue00b', '\uea3e'] },
    ];

    themes.forEach(theme => {
        if (textContext.match(theme.keywords)) {
            primaryIcons.push(...theme.icons);
        }
    });

    if (primaryIcons.length === 0) {
        // Generic "Everything" Mix - heavily expanded for infinite diversity
        primaryIcons = [
            '\ue838', '\ue87d', '\ue811', '\ue65f', '\ue430', '\ue2bd', '\uea35', // heart, star, smile, sparkles, sun, cloud, leaf
            '\ue88a', '\ue531', '\ue532', '\uea19', '\ue56c', '\ue891', '\uea41', // home, flight, train, book, restaurant, flower, grass
            '\ue3c9', '\uea3e', '\ue942', '\uea2f', '\ueb3b', '\ue91d', '\ue30a', // pencil, feather, diamond, soccer, rainy, pets, computer
            '\ue850', '\ue869', '\ue405', '\ue030', '\ue0b0', '\ue8d1', '\uea2c', // wallet, settings, music, mic, call, bag, celebrity
            '\uea0b', '\ue552', '\uea1b', '\ufc31', '\uea61', '\ue769', '\ueba5', // cake, pizza, icecream, cookie, burger, waves, rocket
            '\ue195', '\uea4c', '\ueba3', '\ue1cd', '\ue3af', '\ue412', '\uea5c', // plane, city, seafish, nature, photo, art, math
            '\ueb3c', '\ue894', '\ue1b1', '\ue8cc', '\ue192', '\uea4b', '\ue1b4'  // medical, eco, home, shop, time, science, military
        ];
    }

    const step = 6; // Denser grid for better coverage
    pdf.saveGraphicsState();

    // Ensure icons have contrast and visibility
    const rgb = hexToRgb(color);
    pdf.setTextColor(rgb.r, rgb.g, rgb.b);
    pdf.setGState(new (pdf as any).GState({ opacity })); // Use passed opacity

    try {
        pdf.setFont('MaterialSymbols', 'normal');
    } catch (e) {
        // Fallback
    }

    const placedHistory: { x: number, y: number, r: number }[] = [];
    const margin = 10; // Extra bleed for patterns

    for (let x = -margin; x < w + margin; x += step) {
        for (let y = -margin; y < h + margin; y += step) {
            // STRICT EXCLUSION: No icons inside the main content boxes
            const isInsideBox = excludeAreas.some(area =>
                x > area.x - 3 && x < area.x + area.w + 3 &&
                y > area.y - 3 && y < area.y + area.h + 3
            );
            if (isInsideBox) continue;

            // ORGANIC SCATTERING: Vary probability based on distance from center for better flow
            const centerX = w / 2;
            const centerY = h / 2;
            const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const probability = 0.55 + (distFromCenter / w) * 0.15; // Slightly more dense at edges

            if (Math.random() > probability) continue;

            // Better jitter for organic look
            const jX = x + (Math.random() - 0.5) * step * 2.5;
            const jY = y + (Math.random() - 0.5) * step * 2.5;

            // Re-check jittered point against boxes
            const isJitterInside = excludeAreas.some(area =>
                jX > area.x - 2 && jX < area.x + area.w + 2 &&
                jY > area.y - 2 && jY < area.y + area.h + 2
            );
            if (isJitterInside) continue;

            const isFiller = Math.random() > 0.65;
            const icon = isFiller
                ? fillerIcons[Math.floor(Math.random() * fillerIcons.length)]
                : primaryIcons[Math.floor(Math.random() * primaryIcons.length)];

            const size = isFiller
                ? 12 + Math.random() * 8
                : 26 + Math.random() * 12;

            const radius = (size * 0.35) * 0.75;

            // Collision check with better tolerance
            const collision = placedHistory.some(p => {
                const dist = Math.sqrt(Math.pow(jX - p.x, 2) + Math.pow(jY - p.y, 2));
                return dist < (radius + p.r + 3); // 3mm buffer for clarity
            });

            if (collision) continue;

            const angle = (Math.random() - 0.5) * 60;
            pdf.setFontSize(size);
            pdf.text(icon, jX, jY, { angle: angle });
            placedHistory.push({ x: jX, y: jY, r: radius });
        }
    }
    pdf.restoreGraphicsState();
}

function drawThemeIcon(pdf: jsPDF, x: number, y: number, size: number, type: string) {
    // Deprecated: Material Symbols are used directly in drawIconBackground
}

function drawOrnament(
    pdf: jsPDF, x: number, y: number, width: number, ornament: any) {
    if (!ornament || ornament.type !== 'vintage-diamond') return;

    const rgb = hexToRgb(ornament.color);
    pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.setLineWidth(0.2);

    const diamondSize = 2.4;
    const centerGap = 3.5;
    const lineMargin = 5;

    const centerX = x + width / 2;

    // Draw lines
    const lineY = y;
    const leftLineEnd = centerX - (centerGap / 2) - (diamondSize * 1.5) - 2;
    const rightLineStart = centerX + (centerGap / 2) + (diamondSize * 1.5) + 2;

    pdf.line(x + lineMargin, lineY, leftLineEnd, lineY);
    pdf.line(rightLineStart, lineY, x + width - lineMargin, lineY);

    const drawDiamondProper = (cx: number, cy: number, size: number) => {
        pdf.triangle(
            cx, cy - size / 2,
            cx - size / 2, cy,
            cx + size / 2, cy,
            'F'
        );
        pdf.triangle(
            cx, cy + size / 2,
            cx - size / 2, cy,
            cx + size / 2, cy,
            'F'
        );
    };

    // Draw 3 diamonds
    const dDist = diamondSize + 0.8;
    drawDiamondProper(centerX - dDist, lineY, diamondSize * 0.75);
    drawDiamondProper(centerX, lineY, diamondSize);
    drawDiamondProper(centerX + dDist, lineY, diamondSize * 0.75);
}

async function addCustomFrontMatterPage(
    pdf: jsPDF,
    page: FrontMatterPage,
    backgroundImage: string | undefined,
    customization: PDFCustomization | undefined,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    isLeftPage: boolean,
    isFirstPage: boolean = false,
    samplePuzzle?: PuzzlePage
) {
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const pageType = page.type || 'standard';

    // 1. Draw Background
    if (backgroundImage) {
        await drawBackgroundImageWithBleed(pdf, backgroundImage, pageWidth, pageHeight, pageSpec, customization);
    } else {
        const rgb = hexToRgb(template.background.color || '#FFFFFF');
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    const mirrored = getMirroredMargins(isLeftPage, pageSpec);
    const contentBoxPadding = template.contentBox.padding;
    const contentBoxX = mirrored.left;
    const contentBoxY = mirrored.top;
    const contentBoxW = mirrored.right - mirrored.left;
    const contentBoxH = mirrored.bottom - mirrored.top;

    // 1.5 Draw Seamless Pattern
    if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
        const excludeAreas = [{ x: contentBoxX, y: contentBoxY, w: contentBoxW, h: contentBoxH }];
        drawSeamlessPattern(
            pdf, pageWidth, pageHeight, customization.seamlessPattern,
            customization.fontColors?.description || '#000000',
            page.title,
            excludeAreas,
            [],
            customization
        );
    }

    // 2. Content Box
    drawBox(pdf, contentBoxX, contentBoxY, contentBoxW, contentBoxH, template.contentBox, customization);

    // Add extra padding to ensure content stays well within bounds
    const extraPadding = 5; // mm - reduced from 10mm
    const innerX = contentBoxX + contentBoxPadding + extraPadding;
    const innerY = contentBoxY + contentBoxPadding + extraPadding;
    const innerW = contentBoxW - (contentBoxPadding * 2) - (extraPadding * 2);
    const innerH = contentBoxH - (contentBoxPadding * 2) - (extraPadding * 2);

    // Components Measurement
    const scale = getScalingFactor(pageWidth, pageHeight);
    const titleFontName = getSectionFont(pdf, 'title', 'helvetica', customization);
    const descFontName = getSectionFont(pdf, 'description', 'helvetica', customization);
    const titleColor = customization?.titleColor || customization?.fontColors?.title || '#000000';
    const titleRgb = hexToRgb(titleColor);

    // Calculate text widths with safe margins (95% of available width for maximum space usage)
    const safeTextWidth = innerW * 0.95;

    // Reserve space for logo if present on first page
    const logoReservedSpace = (isFirstPage && customization?.bookLogo) ? 35 * scale : 0; // mm
    const availableContentHeight = innerH - logoReservedSpace;

    // Calculate total height needed for content to center vertically
    const fontSize = (page.fontSize || 12) * scale;
    pdf.setFontSize(fontSize);
    safeSetFont(pdf, descFontName, 'normal');
    const contentLines = pdf.splitTextToSize(page.content, safeTextWidth);
    const contentH = contentLines.length * fontSize * 0.3528 * 1.5;

    // Reduce title-page multiplier from 1.4 to 1.2 to prevent overflow
    const titleFontSize = (pageType === 'title-page' ? (customization?.fontSizes?.title || 28) * 1.2 : (customization?.fontSizes?.title || 28)) * scale;
    pdf.setFontSize(titleFontSize);
    safeSetFont(pdf, titleFontName, 'bold');
    const titleLines = pdf.splitTextToSize(page.title, safeTextWidth);
    const titleH = titleLines.length * titleFontSize * 0.3528 * 1.2;

    const subtitleSize = ((customization?.fontSizes?.description || 14) * 1.2) * scale;
    const subtitleLines = page.subtitle ? pdf.splitTextToSize(page.subtitle, safeTextWidth) : [];
    const subtitleH = page.subtitle ? (subtitleLines.length * subtitleSize * 0.3528 * 1.3) : 0;

    const dividerH = 10 * scale; // Space for ornament
    const verticalGap = 3 * scale; // Reduced gap between title and ornament
    const contentGap = 8 * scale; // Gap for other elements

    // For 'how-to-use' pages, we reserve space for the grid in the height calculation
    const howToUseGridHeight = (pageType === 'how-to-use' && samplePuzzle) ? 60 * scale : 0;

    const totalContentHeight = titleH + (page.subtitle ? subtitleH + contentGap : 0) + verticalGap + dividerH + contentH + contentGap + howToUseGridHeight;

    // Calculate starting Y position with proper top padding, accounting for logo space
    let currentY = innerY + Math.max(10, (availableContentHeight - totalContentHeight) / 2);

    // For copyright pages, align to bottom with padding
    if (pageType === 'copyright') {
        currentY = innerY + availableContentHeight - totalContentHeight - 10;
    }

    // Ensure we don't start too close to the top
    currentY = Math.max(currentY, innerY + 10);

    // 3. Render Title
    pdf.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
    pdf.setFontSize(titleFontSize);
    safeSetFont(pdf, titleFontName, 'bold');
    const titleX = innerX + innerW / 2;
    pdf.text(titleLines, titleX, currentY, { align: 'center', maxWidth: safeTextWidth });
    currentY += titleH + verticalGap;

    // 4. Render Subtitle (if any)
    if (page.subtitle) {
        pdf.setFontSize(subtitleSize);
        safeSetFont(pdf, descFontName, 'bold');
        const subtitleX = innerX + innerW / 2;
        pdf.text(subtitleLines, subtitleX, currentY, { align: 'center', maxWidth: safeTextWidth });
        currentY += subtitleH + contentGap;
    }

    // 5. Draw Ornament / Graphic Divider
    const dividerY = currentY + 2;
    const centerX = innerX + innerW / 2;
    pdf.setDrawColor(titleRgb.r, titleRgb.g, titleRgb.b);
    pdf.setLineWidth(0.4);
    const lineWidth = Math.min(20, innerW * 0.15);
    pdf.line(centerX - lineWidth, dividerY, centerX + lineWidth, dividerY);

    // Tiny decorative Diamond
    pdf.setFillColor(titleRgb.r, titleRgb.g, titleRgb.b);
    const dSize = 1.2;
    pdf.moveTo(centerX, dividerY - dSize);
    pdf.lineTo(centerX + dSize, dividerY);
    pdf.lineTo(centerX, dividerY + dSize);
    pdf.lineTo(centerX - dSize, dividerY);
    pdf.fill();

    currentY += dividerH + contentGap;

    // 6. Render Main Content
    const align = page.alignment || 'center';
    let textX: number;
    if (align === 'center') {
        textX = innerX + innerW / 2;
    } else if (align === 'right') {
        textX = innerX + innerW - (innerW - safeTextWidth) / 2;
    } else {
        textX = innerX + (innerW - safeTextWidth) / 2;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(page.fontSize || 12);
    safeSetFont(pdf, descFontName, 'normal');
    pdf.text(contentLines, textX, currentY, { align: align as any, lineHeightFactor: 1.5, maxWidth: safeTextWidth });
    currentY += contentH;

    // 6.5. Render Sample Solution Grid for "How to Use" pages
    if (pageType === 'how-to-use') {
        const solutionGap = 10; // mm gap between text and solution
        currentY += solutionGap;

        // Use sample puzzle or dummy fallback
        const puzzleData = samplePuzzle?.puzzle || DUMMY_EXAMPLE_PUZZLE;

        // Calculate available space for solution grid
        // Reserve space for logo if needed
        const logoSpace = (isFirstPage && customization?.bookLogo ? 35 : 10);
        const availableHeight = Math.max(40, (innerY + innerH) - currentY - logoSpace);

        // We want the grid to be prominent but not overflow
        const maxGridSize = Math.min(innerW * 0.75, availableHeight, 75);

        // Draw solution grid centered
        const gridX = innerX + (innerW - maxGridSize) / 2;
        const gridY = currentY;

        try {
            // Draw a small label above the grid
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            safeSetFont(pdf, descFontName, 'italic');
            pdf.text('Example Solution:', innerX + innerW / 2, gridY - 3, { align: 'center' });

            // Draw the solution grid
            drawSolutionGrid(
                pdf,
                puzzleData,
                puzzleData.words,
                gridX,
                gridY,
                maxGridSize,
                maxGridSize,
                customization,
                customization?.customFont ? 'CustomFont' : 'helvetica',
                template
            );

            currentY += maxGridSize + 5;
        } catch (e) {
            console.warn('Failed to render sample solution grid:', e);
        }
    }

    // 7. Render Logo on First Page at Bottom
    if (isFirstPage && customization?.bookLogo) {
        try {
            const logo = await loadImage(customization.bookLogo);
            const logoMaxWidth = innerW * 0.4;
            const logoMaxHeight = 25; // mm
            const scale = Math.min(logoMaxWidth / logo.width, logoMaxHeight / logo.height);
            const logoW = logo.width * scale;
            const logoH = logo.height * scale;

            // Position logo with proper spacing after content
            const logoTopMargin = 15; // mm gap between content and logo
            const logoBottomMargin = 10; // mm from bottom of content box

            // Start position: after content with gap
            let logoY = currentY + logoTopMargin;

            // If there's not enough space, try to fit it at the bottom
            if (logoY + logoH > innerY + innerH - logoBottomMargin) {
                logoY = innerY + innerH - logoH - logoBottomMargin;
            }

            // Final check: ensure logo doesn't overlap with content
            if (logoY < currentY + 5) {
                // Not enough space, skip logo or reduce size
                console.warn('Not enough space for logo on front matter page');
                return;
            }

            pdf.addImage(logo.dataUrl, 'PNG', innerX + (innerW - logoW) / 2, logoY, logoW, logoH);
        } catch (e) {
            console.warn('Failed to add logo to front matter:', e);
        }
    }
}


async function addDifficultySeparatorPage(
    pdf: jsPDF,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    customization?: PDFCustomization,
    backgroundImage?: string
) {
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const pageNum = pdf.getNumberOfPages();
    const frontMatterOffset = customization?.frontMatterPageCount || 0;
    const bookPageNum = pageNum + frontMatterOffset;
    const isLeftPage = bookPageNum % 2 === 0;
    const mirrored = getMirroredMargins(isLeftPage, pageSpec);

    // 1. Draw Background
    if (backgroundImage) {
        await drawBackgroundImageWithBleed(pdf, backgroundImage, pageWidth, pageHeight, pageSpec, customization);
    } else {
        const rgb = hexToRgb(template.background.color || '#FFFFFF');
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // 1.5 Draw Seamless Pattern for Separator
    if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
        const excludeAreas = [
            { x: mirrored.left, y: mirrored.top, w: mirrored.right - mirrored.left, h: mirrored.bottom - mirrored.top }
        ];
        drawSeamlessPattern(
            pdf,
            pageWidth,
            pageHeight,
            customization.seamlessPattern,
            customization.fontColors?.description || '#000000',
            difficulty + " level",
            excludeAreas,
            [], // No specific words for separator
            customization
        );
    }

    // 2. Draw Content Box (same as puzzle pages)
    const safeWidth = mirrored.right - mirrored.left;
    const safeHeight = mirrored.bottom - mirrored.top;
    drawBox(pdf, mirrored.left, mirrored.top, safeWidth, safeHeight, { ...template.contentBox, fillColor: '#FFFFFF' }, customization);

    // 3. Draw Text
    const scale = getScalingFactor(pageWidth, pageHeight);
    const titleFontSize = (customization?.fontSizes?.title || 32) * scale;
    const titleColor = customization?.titleColor || '#000000';
    const titleRgb = hexToRgb(titleColor);
    pdf.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
    pdf.setFontSize(titleFontSize);
    const titleFontName = getSectionFont(pdf, 'title', (customization?.customFont ? 'CustomFont' : 'helvetica'), customization);
    safeSetFont(pdf, titleFontName, 'bold');

    const text = `${difficulty} Level`;
    const textWidth = pdf.getTextWidth(text);
    const x = mirrored.left + (safeWidth - textWidth) / 2;
    const y = mirrored.top + (safeHeight / 2);

    pdf.text(text, x, y);

}

async function addSolutionsSeparatorPage(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    customization?: PDFCustomization,
    backgroundImage?: string
) {
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const pageNum = pdf.getNumberOfPages();
    const frontMatterOffset = customization?.frontMatterPageCount || 0;
    const bookPageNum = pageNum + frontMatterOffset;
    const isLeftPage = bookPageNum % 2 === 0;
    const mirrored = getMirroredMargins(isLeftPage, pageSpec);

    // 1. Draw Background
    if (backgroundImage) {
        await drawBackgroundImageWithBleed(pdf, backgroundImage, pageWidth, pageHeight, pageSpec, customization);
    } else {
        const rgb = hexToRgb(template.background.color || '#FFFFFF');
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }
    // 1.5 Draw Seamless Pattern
    if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
        const excludeAreas = [{ x: mirrored.left, y: mirrored.top, w: mirrored.right - mirrored.left, h: mirrored.bottom - mirrored.top }];
        drawSeamlessPattern(
            pdf, pageWidth, pageHeight, customization.seamlessPattern,
            customization.fontColors?.description || '#000000',
            "solutions",
            excludeAreas,
            [],
            customization
        );
    }

    // 2. Draw Content Box
    const safeWidth = mirrored.right - mirrored.left;
    const safeHeight = mirrored.bottom - mirrored.top;
    drawBox(pdf, mirrored.left, mirrored.top, safeWidth, safeHeight, { ...template.contentBox, fillColor: '#FFFFFF' }, customization);

    // 3. Draw Text
    const scale = getScalingFactor(pageWidth, pageHeight);
    const titleFontSize = (customization?.fontSizes?.title || 32) * scale;
    const titleColor = customization?.titleColor || '#000000';
    const titleRgb = hexToRgb(titleColor);
    pdf.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
    pdf.setFontSize(titleFontSize);
    const titleFontName = getSectionFont(pdf, 'title', (customization?.customFont ? 'CustomFont' : 'helvetica'), customization);
    safeSetFont(pdf, titleFontName, 'bold');

    const text = 'Solutions';
    const textWidth = pdf.getTextWidth(text);
    const x = mirrored.left + (safeWidth - textWidth) / 2;
    const y = mirrored.top + (safeHeight / 2);

    pdf.text(text, x, y);

}

// Helper to draw styled boxes
function drawBox(pdf: jsPDF, x: number, y: number, width: number, height: number, style: any, customization?: PDFCustomization) { // Using 'any' briefly to bypass strict type checking against Template imports if they mismatch, or use BoxStyle if imported
    if (!style) return;

    if (style.fillColor && style.fillColor !== 'transparent') {
        const rgb = hexToRgb(style.fillColor);
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);

        // Apply radius to fill as well
        if (style.border && style.border.radius > 0) {
            pdf.roundedRect(x, y, width, height, style.border.radius, style.border.radius, 'F');
        } else {
            pdf.rect(x, y, width, height, 'F');
        }
    }

    if (style.border && style.border.style !== 'none' && style.border.width > 0) {
        let borderColor = style.border.color;
        if (customization?.fontColors?.contentBoxOutline) {
            borderColor = customization.fontColors.contentBoxOutline;
        }
        const rgb = hexToRgb(borderColor);
        pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
        // jsPDF lineWidth is in user units (mm)
        pdf.setLineWidth(style.border.width);

        if (style.border.style === 'dashed') {
            pdf.setLineDashPattern([3, 1], 0);
        } else if (style.border.style === 'dotted') {
            pdf.setLineDashPattern([1, 1], 0);
        } else {
            pdf.setLineDashPattern([], 0);
        }

        if (style.border.radius > 0) {
            pdf.roundedRect(x, y, width, height, style.border.radius, style.border.radius, 'S');
        } else {
            pdf.rect(x, y, width, height, 'S');
        }
        // Reset dash
        pdf.setLineDashPattern([], 0);
    }
}

async function addPuzzlePage(
    pdf: jsPDF,
    puzzlePage: PuzzlePage,
    backgroundImage: string | undefined,
    customization: PDFCustomization | undefined,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    isLeftPage: boolean,
    layoutMode: LayoutMode,
    actualPageNum?: number,
    frontMatterOffset?: number
) {
    const template = customization?.template || DEFAULT_TEMPLATES[0];
    const PT_TO_MM = 0.3528;

    // 1. Draw Background
    if (backgroundImage) {
        await drawBackgroundImageWithBleed(pdf, backgroundImage, pageWidth, pageHeight, pageSpec, customization);
    } else if (template.background.image) {
        await drawBackgroundImageWithBleed(pdf, template.background.image, pageWidth, pageHeight, pageSpec, customization);
    } else {
        const rgb = hexToRgb(template.background.color);
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // 2. Geometry Setup
    const mirrored = getMirroredMargins(isLeftPage, pageSpec);
    const contentBoxPadding = template.contentBox.padding;
    const contentBoxX = mirrored.left;
    const contentBoxY = mirrored.top;
    const contentBoxW = mirrored.right - mirrored.left;
    const contentBoxH = mirrored.bottom - mirrored.top;

    // 1.5 Draw Seamless Pattern
    if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
        const excludeAreas = [{ x: contentBoxX, y: contentBoxY, w: contentBoxW, h: contentBoxH }];
        drawSeamlessPattern(
            pdf,
            pageWidth,
            pageHeight,
            customization.seamlessPattern,
            customization.fontColors?.description || '#000000',
            puzzlePage.title,
            excludeAreas,
            puzzlePage.puzzle.words.map(w => w.word),
            customization
        );
    }

    drawBox(pdf, contentBoxX, contentBoxY, contentBoxW, contentBoxH, template.contentBox, customization);

    // Inner area for content
    const innerX = contentBoxX + contentBoxPadding;
    const innerY = contentBoxY + contentBoxPadding;
    const innerW = contentBoxW - (contentBoxPadding * 2);
    const innerH = contentBoxH - (contentBoxPadding * 2);

    // Components Measurement
    const scale = getScalingFactor(pageWidth, pageHeight);
    const titleFont = template.typography.title;
    const descFont = template.typography.description;
    const titleFontSize = (customization?.fontSizes?.title || titleFont.fontSize) * scale;
    const descFontSize = (customization?.fontSizes?.description || descFont.fontSize) * scale;
    const hasDesc = !!puzzlePage.description;

    const titleVisualH = titleFontSize * PT_TO_MM * 1.2;
    const descVisualH = hasDesc ? descFontSize * PT_TO_MM * 1.4 : 0;
    const gap = 5 * scale;

    // Grid Dimensions
    const grid = puzzlePage.puzzle.grid as string[][];
    const gridSize = grid.length;

    // Word List Height Measurement
    const words = puzzlePage.puzzle.words;
    const wordHeadingHeight = 0;
    const wordListItemsFontSize = (customization?.fontSizes?.wordListItems || template.typography.wordListItems.fontSize) * scale;
    const wordListFont = template.typography.wordListItems;
    const wordLineHeightMm = wordListItemsFontSize * wordListFont.lineHeight * PT_TO_MM;
    const numColumns = 3;
    const itemsPerCol = Math.ceil(words.length / numColumns);
    const wordLineHeightRefined = wordListItemsFontSize * (wordListFont.lineHeight || 1.4) * PT_TO_MM; // Use template line height
    const wordListItemsHeight = (itemsPerCol - 1) * wordLineHeightRefined;

    const isRetro = template.id === 'retro-words-premium' || template.id === 'retro-words';
    const effectiveHeadingReserved = isRetro ? 0 : wordHeadingHeight;
    const wordBoxPad = (isRetro ? 7 : template.wordBox.padding) * scale;
    const wordListBoxHeight = effectiveHeadingReserved + wordListItemsHeight + (wordBoxPad * 2);

    const ornamentH = template.ornament ? template.ornament.spacing * scale : 0;

    // Calculate Grid Size based on remaining space
    const topHeaderHeight = titleVisualH + (hasDesc ? descVisualH : 0) + (template.ornament ? ornamentH : gap);
    const availableForGrid = innerH - topHeaderHeight - wordListBoxHeight - (gap * 2);

    let cellWidth = availableForGrid / gridSize;
    const maxGridWidth = innerW - (template.gridBox.padding * 2 * scale);
    const cellWidthByWidth = maxGridWidth / gridSize;
    const cellSize = Math.min(cellWidth, cellWidthByWidth, 14 * scale); // Optimized max size

    const finalGridSize = cellSize * gridSize;
    const gridBoxSize = finalGridSize + (template.gridBox.padding * 2 * scale);

    // 1.5 Draw Seamless Pattern if enabled (Now with box knowledge)
    if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
        // Comprehensive exclusion areas to avoid overlapping with any text/elements
        const excludeAreas = [
            { x: contentBoxX, y: contentBoxY, w: contentBoxW, h: contentBoxH }
        ];

        // Exclude bottom page number area
        if (customization?.showPageNumbers) {
            excludeAreas.push({
                x: 0,
                y: pageHeight - pageSpec.margins.bottom - 5,
                w: pageWidth,
                h: pageSpec.margins.bottom + 10
            });
        }

        drawSeamlessPattern(
            pdf,
            pageWidth,
            pageHeight,
            customization.seamlessPattern,
            customization.fontColors?.description || '#000000',
            puzzlePage.title,
            excludeAreas,
            puzzlePage.puzzle.words.map(w => w.word),
            customization
        );
    }

    // 4. Final Centering Logic
    let currentY = innerY;
    if (isRetro) {
        // High-precision height for Retro flow
        const retroGapPageToTitle = 10 * scale;
        const retroGapTitleToOrnament = 0.5 * scale;
        const retroGapOrnamentToBox = 2.5 * scale;
        const retroGapBoxToGrid = 5 * scale;

        const badgeVisualH = 10 * scale; // Capsule + text base
        const totalRetroH = (customization?.showPageNumbers && template.pageNumber.position.startsWith('top') ? badgeVisualH + retroGapPageToTitle : 0) + titleVisualH + retroGapTitleToOrnament + ornamentH + retroGapOrnamentToBox + wordListBoxHeight + retroGapBoxToGrid + gridBoxSize;

        // Center relative to physical page edge
        currentY = (pageHeight - totalRetroH) / 2;

        if (customization?.showPageNumbers && template.pageNumber.position.startsWith('top')) {
            drawPageNumber(pdf, actualPageNum!, pageWidth, pageHeight, pageSpec, customization, currentY, isLeftPage);
            currentY += badgeVisualH + retroGapPageToTitle;
        } else if (isRetro) {
            // If not showing at top, we still might want to offset the title a bit for design
            // but let's keep it tight if user moved page number away
            currentY += 5 * scale;
        }
    } else {
        const totalContentH = topHeaderHeight + gridBoxSize + wordListBoxHeight + gap;
        const verticalCenteringOffset = Math.max(0, (innerH - totalContentH) / 2);
        currentY = innerY + verticalCenteringOffset;
    }

    // Helper: Draw Puzzle Grid
    const drawPuzzleGrid = (yPos: number) => {
        const gridBoxX = innerX + (innerW - gridBoxSize) / 2;
        drawBox(pdf, gridBoxX, yPos, gridBoxSize, gridBoxSize, template.gridBox, customization);
        const gridInnerX = gridBoxX + template.gridBox.padding;
        const gridInnerY = yPos + template.gridBox.padding;

        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.2);
        for (let i = 0; i <= gridSize; i++) {
            const pos = gridInnerX + (i * cellSize);
            pdf.line(pos, gridInnerY, pos, gridInnerY + finalGridSize);
            pdf.line(gridInnerX, gridInnerY + (i * cellSize), gridInnerX + finalGridSize, gridInnerY + (i * cellSize));
        }

        const letterFont = template.typography.gridLetters;
        const gridLettersFontSize = customization?.fontSizes?.gridLetters || letterFont.fontSize;
        const finalGridFont = getSectionFont(pdf, 'grid', letterFont.fontFamily, customization);
        safeSetFont(pdf, finalGridFont, 'normal');
        pdf.setFontSize(gridLettersFontSize);
        const letterRgb = hexToRgb(customization?.fontColors?.gridLetters || letterFont.color);
        pdf.setTextColor(letterRgb.r, letterRgb.g, letterRgb.b);

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const letter = grid[row][col];
                if (letter) {
                    const x = gridInnerX + (col * cellSize) + (cellSize / 2);
                    const y = gridInnerY + ((row + 1) * cellSize) - (cellSize * 0.25);
                    pdf.text(letter, x, y, { align: 'center' });
                }
            }
        }
    };

    // Helper: Draw Word List
    const drawWordList = (yPos: number) => {
        // Special case for Retro Words template: fancy notched container
        if (template.id === 'retro-words-premium' || template.id === 'retro-words') {
            const r = 7.0; // Enhanced Inward Notch radius for luxury feel
            const w = innerW;
            const h = wordListBoxHeight;
            const x = innerX;
            const y = yPos;

            const drawTrueInwardNotch = (ox: number, oy: number, ow: number, oh: number, ir: number) => {
                const k = 0.55228; // Standard kappa

                pdf.moveTo(ox + ir, oy);
                pdf.lineTo(ox + ow - ir, oy);
                // Top-right inward notch (Corner is at ox+ow, oy)
                // We want to bend IN towards ox+ow-ir, oy+ir? No, that's not right.
                // Inward notch means the corner is MISSING.
                // The path should be line to ox+ow-ir,oy then curve to ox+ow,oy+ir
                pdf.curveTo(ox + ow - ir, oy + ir * k, ox + ow - ir * k, oy + ir, ox + ow, oy + ir);

                pdf.lineTo(ox + ow, oy + oh - ir);
                // Bottom-right inward notch
                pdf.curveTo(ox + ow - ir * k, oy + oh - ir, ox + ow - ir, oy + oh - ir * k, ox + ow - ir, oy + oh);

                pdf.lineTo(ox + ir, oy + oh);
                // Bottom-left inward notch
                pdf.curveTo(ox + ir, oy + oh - ir * k, ox + ir * k, oy + oh - ir, ox, oy + oh - ir);

                pdf.lineTo(ox, oy + ir);
                // Top-left inward notch
                pdf.curveTo(ox + ir * k, oy + ir, ox + ir, oy + ir * k, ox + ir, oy);
            };

            // Shadow
            pdf.setDrawColor(215, 215, 215);
            pdf.setLineWidth(0.4);
            const sOff = 1.1;
            drawTrueInwardNotch(x + sOff, y + sOff, w, h, r);
            pdf.stroke();

            // Frame 1 (Outer - High contrast)
            const frame1Color = customization?.fontColors?.contentBoxOutline || '#3C3C3C';
            const frame1Rgb = hexToRgb(frame1Color);
            pdf.setDrawColor(frame1Rgb.r, frame1Rgb.g, frame1Rgb.b);
            pdf.setLineWidth(0.4);
            drawTrueInwardNotch(x, y, w, h, r);
            pdf.stroke();

            // Frame 2 (Inner - Fine line)
            pdf.setDrawColor(140, 140, 140);
            pdf.setLineWidth(0.18);
            const inset = 1.3;
            drawTrueInwardNotch(x + inset, y + inset, w - (inset * 2), h - (inset * 2), r - 0.5);
            pdf.stroke();
        } else {
            drawBox(pdf, innerX, yPos, innerW, wordListBoxHeight, template.wordBox, customization);
        }
        const listInnerX = innerX + template.wordBox.padding;
        const listInnerY = yPos + template.wordBox.padding;
        const listInnerW = innerW - (template.wordBox.padding * 2);

        const skipHeading = true; // Always skip heading as requested

        if (!skipHeading) {
            const headingFont = template.typography.wordListHeading;
            const wordListHeadingFontSize = customization?.fontSizes?.wordListHeading || headingFont.fontSize;
            const finalWordHeadingFont = getSectionFont(pdf, 'wordList', headingFont.fontFamily, customization);
            safeSetFont(pdf, finalWordHeadingFont, 'bold');
            pdf.setFontSize(wordListHeadingFontSize);
            const headingRgb = hexToRgb(customization?.fontColors?.wordListHeading || headingFont.color);
            pdf.setTextColor(headingRgb.r, headingRgb.g, headingRgb.b);
            pdf.text("Words to Find", listInnerX + listInnerW / 2, listInnerY + 6, { align: 'center' });
        }

        const itemsFont = template.typography.wordListItems;
        const finalWordItemsFont = getSectionFont(pdf, 'wordList', itemsFont.fontFamily, customization);
        safeSetFont(pdf, finalWordItemsFont, 'normal');
        pdf.setFontSize(wordListItemsFontSize);
        const itemsRgb = hexToRgb(customization?.fontColors?.wordListItems || itemsFont.color);
        pdf.setTextColor(itemsRgb.r, itemsRgb.g, itemsRgb.b);

        const totalItemsVisualH = (itemsPerCol - 1) * wordLineHeightRefined;
        const startItemsY = listInnerY + ((wordListBoxHeight - (wordBoxPad * 2) - totalItemsVisualH) / 2) + (wordListItemsFontSize * 0.25 * PT_TO_MM);

        const colWidth = listInnerW / numColumns;
        puzzlePage.puzzle.words.forEach((w, i) => {
            const col = Math.floor(i / itemsPerCol);
            const row = i % itemsPerCol;
            const cx = listInnerX + (col * colWidth) + (colWidth / 2);
            const cy = startItemsY + (row * wordLineHeightRefined);
            pdf.text(w.word.toUpperCase(), cx, cy, { align: 'center' });
        });
    };

    // 5. Drawing Order
    // Title
    const finalTitleFont = getSectionFont(pdf, 'title', titleFont.fontFamily, customization);
    safeSetFont(pdf, finalTitleFont, 'bold');
    pdf.setFontSize(titleFontSize);
    const titleRgb = hexToRgb(customization?.fontColors?.title || customization?.titleColor || titleFont.color);
    pdf.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
    let titleX = innerX + innerW / 2;
    if (titleFont.alignment === 'left') titleX = innerX;
    else if (titleFont.alignment === 'right') titleX = innerX + innerW;
    pdf.text(cleanString(puzzlePage.title).toUpperCase(), titleX, currentY + (titleFontSize * PT_TO_MM * 0.8), { align: titleFont.alignment as any });
    currentY += titleVisualH;

    // Ornament?
    if (isRetro) {
        currentY += 0.5; // retroGapTitleToOrnament
        drawOrnament(pdf, innerX, currentY + (ornamentH / 2), innerW, template.ornament);
        currentY += ornamentH + 2.5; // ornamentHeight + retroGapOrnamentToBox
    } else if (template.ornament) {
        drawOrnament(pdf, innerX, currentY + (ornamentH / 2), innerW, template.ornament);
        currentY += ornamentH;
    }

    // Description (Exclude for Template 21)
    const skipDesc = template.id === 'retro-words-premium' || template.id === 'retro-words';

    if (hasDesc && !skipDesc) {
        const finalDescFont = getSectionFont(pdf, 'description', descFont.fontFamily, customization);
        safeSetFont(pdf, finalDescFont, 'normal');
        pdf.setFontSize(descFontSize);
        const descRgb = hexToRgb(customization?.fontColors?.description || descFont.color);
        pdf.setTextColor(descRgb.r, descRgb.g, descRgb.b);
        let descX = innerX + innerW / 2;
        if (descFont.alignment === 'left') descX = innerX;
        else if (descFont.alignment === 'right') descX = innerX + innerW;
        pdf.text(cleanString(puzzlePage.description!), descX, currentY + (descFontSize * PT_TO_MM * 0.8), { align: descFont.alignment as any });
        currentY += descVisualH;
    }

    if (!isRetro) {
        if (!template.ornament) currentY += gap;
        else currentY += 5; // Generous professional gap for premium templates
    }

    if (layoutMode === 'words-on-top') {
        drawWordList(currentY);
        const nextGap = isRetro ? 5 : gap;
        currentY += wordListBoxHeight + nextGap;
        drawPuzzleGrid(currentY);
    } else {
        drawPuzzleGrid(currentY);
        const nextGap = isRetro ? 5 : gap;
        currentY += gridBoxSize + nextGap;
        drawWordList(currentY);
    }
}

async function addSolutionsPage(
    pdf: jsPDF,
    puzzles: PuzzlePage[],
    oddBg: string | undefined,
    evenBg: string | undefined,
    customization: PDFCustomization | undefined,
    pageWidth: number,
    pageHeight: number,
    pageSpec: PageSpec,
    startPageNum?: number
) {
    const solutionsPerPage = 4;
    let isFirstSolutionPage = true;
    let solutionIndex = 0;

    // Use template or default
    const template = customization?.template || DEFAULT_TEMPLATES[0];

    for (const puzzlePage of puzzles) {
        // Calculate these once per puzzle
        const pageNum = pdf.getNumberOfPages();
        const frontMatterOffset = customization?.frontMatterPageCount || 0;
        const bookPageNum = pageNum + frontMatterOffset;
        const isLeftPage = bookPageNum % 2 === 0;
        const mirrored = getMirroredMargins(isLeftPage, pageSpec);
        const fontName = customization?.customFont ? 'CustomFont' : 'helvetica';

        const scale = getScalingFactor(pageWidth, pageHeight);

        if (solutionIndex % solutionsPerPage === 0) {
            if (solutionIndex > 0) pdf.addPage();

            // Prioritize customization override bg, then template image, then template color
            let currentBg = isLeftPage ? evenBg : oddBg;

            if (!currentBg) {
                if (template.background.image) {
                    // currentBg = template.background.image; // TODO: Support if needed
                } else if (template.background.color) {
                    // Handled by default fill below if no image
                }
            }

            if (currentBg) {
                await drawBackgroundImageWithBleed(pdf, currentBg, pageWidth, pageHeight, pageSpec, customization);
            } else {
                const rgb = hexToRgb(template.background.color || '#FFFFFF');
                pdf.setFillColor(rgb.r, rgb.g, rgb.b);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            }

            // 1.2 Draw Seamless Pattern for Solutions
            if (customization?.seamlessPattern && customization.seamlessPattern !== 'none') {
                const excludeAreas = [
                    { x: mirrored.left, y: mirrored.top, w: mirrored.right - mirrored.left, h: mirrored.bottom - mirrored.top }
                ];
                drawSeamlessPattern(
                    pdf,
                    pageWidth,
                    pageHeight,
                    customization.seamlessPattern,
                    customization.fontColors?.description || '#000000',
                    "solutions school study",
                    excludeAreas,
                    puzzles.flatMap(p => p.puzzle.words.map(w => w.word)), // Pass all words for global context
                    customization
                );
            }

            // 1. Draw Content Box for solutions page (Bottom layer)
            const safeWidth = mirrored.right - mirrored.left;
            const safeHeight = mirrored.bottom - mirrored.top;
            drawBox(pdf, mirrored.left, mirrored.top, safeWidth, safeHeight, { ...template.contentBox, fillColor: '#FFFFFF' }, customization);

            // 2. Draw Page Number (Middle layer)
            if (customization?.showPageNumbers && startPageNum !== undefined) {
                const currentSolutionPage = Math.floor(solutionIndex / solutionsPerPage);
                drawPageNumber(pdf, startPageNum + currentSolutionPage, pageWidth, pageHeight, pageSpec, customization, undefined, isLeftPage);
            }

            // 3. Add "Solutions" heading at the top of each solutions page (Top layer)
            const headingY = mirrored.top + 12 * scale;
            safeSetFont(pdf, fontName, 'bold');
            pdf.setFontSize(20 * scale);
            pdf.setTextColor(0, 0, 0);
            const headingX = mirrored.left + (safeWidth / 2);
            pdf.text('Solutions', headingX, headingY, { align: 'center' });
        }

        // Variables already declared above, reuse them
        const padding = template.contentBox.padding * scale;
        const headingReserved = 25 * scale;
        const safeX = mirrored.left + padding;
        const safeY = mirrored.top + headingReserved + (padding / 2); // Space for heading + top padding
        const safeWidth = mirrored.right - mirrored.left - (padding * 2);
        const safeHeight = (mirrored.bottom - mirrored.top) - headingReserved - padding;

        const spacing = 10 * scale;
        const solutionWidth = (safeWidth - spacing) / 2;
        const solutionHeight = (safeHeight - spacing) / 2;

        const positionInPage = solutionIndex % solutionsPerPage;
        const col = positionInPage % 2;
        const row = Math.floor(positionInPage / 2);

        let boxX = safeX + (col * (solutionWidth + spacing));
        let boxY = safeY + (row * (solutionHeight + spacing));

        const grid = puzzlePage.puzzle.grid as string[][];
        const gridSize = grid.length;
        const cellSize = Math.min(solutionWidth / gridSize, solutionHeight / gridSize);
        const gridHeight = cellSize * gridSize;
        const gridWidth = cellSize * gridSize;

        // Center grid in available space
        const gridX = boxX + (solutionWidth - gridWidth) / 2;
        const gridY = boxY + (solutionHeight - gridHeight) / 2;

        const title = cleanString(puzzlePage.title);
        const titleX = boxX + (solutionWidth / 2);

        // Title above grid
        safeSetFont(pdf, fontName, 'bold');
        pdf.setFontSize(10 * scale);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, titleX, gridY - (3 * scale), { align: 'center' });

        drawSolutionGrid(pdf, puzzlePage.puzzle, puzzlePage.puzzle.words, gridX, gridY, gridWidth, gridHeight, customization, fontName, template);
        solutionIndex++;
    }
}

function drawSolutionGrid(
    pdf: jsPDF,
    puzzle: PuzzleData,
    wordsToHighlight: typeof puzzle.words,
    startX: number,
    startY: number,
    width: number,
    height: number,
    customization?: PDFCustomization,
    fontName: string = 'helvetica',
    template?: Template // Added template argument
) {
    const grid = puzzle.grid as string[][];
    const gridSize = grid.length;
    const cellSize = Math.min(width / gridSize, height / gridSize);
    const gridWidth = cellSize * gridSize;
    const gridHeight = cellSize * gridSize;
    const gridX = startX + (width - gridWidth) / 2;
    const gridY = startY + (height - gridHeight) / 2;

    // Draw a white background for the individual solution grid
    pdf.setFillColor(255, 255, 255);
    pdf.rect(gridX, gridY, gridWidth, gridHeight, 'F');

    const highlightCells = new Set<string>();
    wordsToHighlight.forEach(wordPlacement => {
        const offset = getDirectionOffset(wordPlacement.direction);
        for (let i = 0; i < wordPlacement.word.length; i++) {
            const r = wordPlacement.row + i * offset.r;
            const c = wordPlacement.col + i * offset.c;
            highlightCells.add(`${r},${c}`);
        }
    });

    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.12);

    for (let i = 0; i <= gridSize; i++) {
        const pos = gridX + (i * cellSize);
        pdf.line(pos, gridY, pos, gridY + gridHeight);
        pdf.line(gridX, gridY + (i * cellSize), gridX + gridWidth, gridY + (i * cellSize));
    }

    const solutionColor = customization?.solutionColor || '#D1D1D1';
    const solutionRgb = hexToRgb(solutionColor);
    pdf.setFillColor(solutionRgb.r, solutionRgb.g, solutionRgb.b);
    highlightCells.forEach(cellKey => {
        const [r, c] = cellKey.split(',').map(Number);
        const x = gridX + (c * cellSize);
        const y = gridY + (r * cellSize);
        pdf.rect(x, y, cellSize, cellSize, 'F');
    });

    pdf.setFontSize(9);
    safeSetFont(pdf, fontName, 'normal');
    pdf.setTextColor(0, 0, 0);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const letter = grid[row][col];
            if (letter) {
                const x = gridX + (col * cellSize) + (cellSize / 2);
                const y = gridY + ((row + 1) * cellSize) - (cellSize / 3.5);
                pdf.text(letter, x, y, { align: 'center' });
            }
        }
    }
}

function getDirectionOffset(direction: string) {
    const offsets: Record<string, { r: number; c: number }> = {
        horizontal: { r: 0, c: 1 },
        vertical: { r: 1, c: 0 },
        'diagonal-down': { r: 1, c: 1 },
        'diagonal-up': { r: -1, c: 1 },
    };
    return offsets[direction] || { r: 0, c: 1 };
}

function loadImage(src: string): Promise<{ dataUrl: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve({
                    dataUrl: canvas.toDataURL('image/png'),
                    width: img.width,
                    height: img.height
                });
            } else {
                reject(new Error('Could not get canvas context'));
            }
        };
        img.onerror = reject;
        img.src = src;
    });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    if (!hex || hex === 'transparent' || hex === '#transparent') {
        return { r: 255, g: 255, b: 255 }; // Default to white but caller often checks for transparent
    }
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return { r, g, b };
}

// Helper to register fonts from customization
async function registerFonts(pdf: jsPDF, customization?: PDFCustomization) {
    let fontName = 'helvetica';

    // 1.5 Load Material Symbols if requested
    const iconBasedPatterns = ['icons', 'flowers', 'stars', 'zen-garden', 'random-icons-clean', 'random-letters-icons', 'random-micro-grid', 'random-diagonal-flow', 'random-dot-icon', 'premium-minimal', 'random-clusters', 'random-horizontal-drift', 'random-vertical-cascade', 'random-negative-blocks', 'random-icon-pairs', 'random-micro-noise', 'random-offset-waves', 'random-large-anchors', 'random-check-rhythm'];
    if (customization?.seamlessPattern && iconBasedPatterns.includes(customization.seamlessPattern)) {
        try {
            // Lazy import to avoid server-side issues if any
            const { fetchGoogleFont } = await import('./font-utils');

            // We force weight 400 and style normal to ensure maximum compatibility with the TTF generator
            const iconFontData = await fetchGoogleFont('Material Symbols Outlined', '400');

            if (iconFontData) {
                pdf.addFileToVFS('MaterialSymbols.ttf', iconFontData);
                pdf.addFont('MaterialSymbols.ttf', 'MaterialSymbols', 'normal', 'Identity-H');

                // Add an explicit mapping for the most common icons to help the font engine
                // Some versions of jsPDF need this for custom TTF fonts
            }
        } catch (e) {
            console.error('Failed to load icons font:', e);
        }
    }

    // 2. Add Global Custom Font
    if (customization?.customFont) {
        const hasRegular = !!customization.customFont.data;
        const hasBold = !!customization.customFont.boldData;

        if (hasRegular || hasBold) {
            try {
                // If we only have Bold, we must still register the 'CustomFont' name
                if (hasRegular) {
                    const regFile = 'user-custom-regular.ttf';
                    pdf.addFileToVFS(regFile, customization.customFont.data!);
                    pdf.addFont(regFile, 'CustomFont', 'normal', 'Identity-H');
                    fontName = 'CustomFont';
                }

                if (hasBold) {
                    const boldFile = 'user-custom-bold.ttf';
                    pdf.addFileToVFS(boldFile, customization.customFont.boldData!);
                    pdf.addFont(boldFile, 'CustomFont', 'bold', 'Identity-H');
                    fontName = 'CustomFont';
                } else if (hasRegular) {
                    // Fallback normal to bold if no bold provided
                    pdf.addFont('user-custom-regular.ttf', 'CustomFont', 'bold', 'Identity-H');
                }
            } catch (e) {
                console.error('Error registering global custom font:', e);
            }
        }
    }

    // 3. Add Section Fonts (Google Fonts)
    if (customization?.sectionFonts) {
        for (const [section, font] of Object.entries(customization.sectionFonts)) {
            if (font && (font as any).data) {
                try {
                    const sectionUpper = section.charAt(0).toUpperCase() + section.slice(1);
                    const sectionFontName = `CustomFont${sectionUpper}`;
                    const fontFileName = `section-${section}.ttf`;

                    pdf.addFileToVFS(fontFileName, (font as any).data);
                    pdf.addFont(fontFileName, sectionFontName, 'normal', 'Identity-H');
                    pdf.addFont(fontFileName, sectionFontName, 'bold', 'Identity-H');
                } catch (e) {
                    console.error(`Error registering section font ${section}:`, e);
                }
            }
        }
    }

    // 4. Set Default Font
    safeSetFont(pdf, fontName);

    return fontName;
}

export async function generatePreviewImage(
    template: Template,
    samplePuzzle: PuzzleData,
    customization?: PDFCustomization
): Promise<string> {
    // 1. Setup Page Specs (Copied logic from generateMultiLevelPDF)
    const pageSpec = JSON.parse(JSON.stringify(DEFAULT_PAGE_SPEC));
    if (customization?.trimSize) {
        const trim = TRIM_SIZES[customization.trimSize];
        pageSpec.trimWidth = trim.width;
        pageSpec.trimHeight = trim.height;
    } else if (customization?.pageFormat) {
        const format = PAGE_FORMATS[customization.pageFormat];
        const isPortrait = (customization?.orientation || 'portrait') === 'portrait';
        pageSpec.trimWidth = isPortrait ? format.width : format.height;
        pageSpec.trimHeight = isPortrait ? format.height : format.width;
    }

    const enableBleed = customization?.enableBleed ?? false;
    if (!enableBleed) {
        pageSpec.bleed = { top: 0, bottom: 0, outer: 0, inner: 0 };
        if (!customization?.trimSize) {
            pageSpec.margins.top = 20;
            pageSpec.margins.bottom = 20;
            pageSpec.margins.inside = 20;
            pageSpec.margins.outside = 20;
        }
    }

    const pageWidth = pageSpec.trimWidth + pageSpec.bleed.outer + pageSpec.bleed.inner;
    const pageHeight = pageSpec.trimHeight + pageSpec.bleed.top + pageSpec.bleed.bottom;

    // 2. Initialize jsPDF
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pageWidth, pageHeight],
        compress: false,
    });

    // 3. Load Fonts
    await registerFonts(pdf, customization);

    // 4. Create Puzzle Page Object
    // Use first available background or template fallback
    const puzzlePage: PuzzlePage = {
        puzzle: samplePuzzle,
        difficulty: 'Medium',
        title: 'Preview Puzzle',
        description: 'This is a preview of your selected options.',
    };

    // 5. Draw Content directly
    const layoutMode = customization?.layoutMode || template.layout;

    // We treat preview as a right-hand (odd) page by default 
    // unless specified otherwise, to show the "recto" layout
    const isLeftPage = false;

    // Handle background logic locally since we aren't iterating
    const oddBg = customization?.oddBackground; // || template background handled in addPuzzlePage

    await addPuzzlePage(
        pdf,
        puzzlePage,
        oddBg,
        { ...customization, template }, // Ensure template is passed
        pageWidth,
        pageHeight,
        pageSpec,
        isLeftPage,
        layoutMode,
        1, // Page number
        0
    );


    // 5. If front-matter or back-matter source is requested, draw that instead
    if ((customization?.previewSource === 'front-matter' || customization?.previewSource === 'back-matter')) {
        const sourceArr = customization.previewSource === 'front-matter' ? customization.frontMatter : customization.backMatter;
        if (sourceArr && sourceArr.length > 0) {
            const fmIdx = customization.frontMatterPreviewIndex || 0;
            const fmPage = sourceArr[fmIdx];
            if (fmPage) {
                // Clear the page first (white overlay)
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');

                await addCustomFrontMatterPage(
                    pdf,
                    fmPage,
                    oddBg,
                    { ...customization, template },
                    pageWidth,
                    pageHeight,
                    pageSpec,
                    false,
                    customization.previewSource === 'front-matter' && fmIdx === 0,
                    { puzzle: samplePuzzle, difficulty: 'Medium', title: 'Preview' }
                );
            }
        }
    }

    // 5. Draw Page Number (Mirroring generateMultiLevelPDF logic)
    if (customization?.showPageNumbers) {
        const actualPageNum = customization?.startPageNumber || 1;
        drawPageNumber(pdf, actualPageNum, pageWidth, pageHeight, pageSpec, { ...customization, template });
    }

    // 6. Rasterize to Image
    try {
        const pdfBuffer = pdf.output('arraybuffer');

        // Use a more robust way to load PDF.js in browser environments
        const pdfjsModule = await import('pdfjs-dist');
        const pdfjs = (pdfjsModule as any).default || pdfjsModule;

        // Configuration for worker - Switching to unpkg which is more reliable for versioned .mjs workers
        const VERSION = pdfjs.version || '4.4.330';
        const workerSrc = `https://unpkg.com/pdfjs-dist@${VERSION}/build/pdf.worker.min.mjs`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

        const loadingTask = pdfjs.getDocument({
            data: pdfBuffer,
            verbosity: 0,
            useSystemFonts: true,
        });

        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);

        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error("Canvas context failed");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Drawing a white background first to avoid transparency issues in preview
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL('image/png', 0.8);

        await pdfDoc.destroy();
        return dataUrl;
    } catch (error) {
        console.error('Error generating preview image:', error);
        throw new Error(`Preview Failed: ${error instanceof Error ? error.message : 'Processing error'}`);
    }
}
