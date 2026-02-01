
export type TrimSize = '6x9' | '8x10' | '8.5x11';

export type PrintSettings = {
    trimSize: TrimSize;
    bleed: boolean;
    margins: {
        top: number;
        bottom: number;
        inner: number;
        outer: number;
    };
    flatten: boolean;
    pageNumbers: {
        enabled: boolean;
        startFrom: 'front-matter' | 'scenes';
        position: 'bottom-center' | 'bottom-outer';
        style: 'simple' | 'with-divider';
        size: 'S' | 'M' | 'L';
    };
};

export type WritingPracticeSettings = {
    minRepetitions: number; // default 3
    guidelines: {
        showTop: boolean;
        showMid: boolean;
        showBase: boolean;
    };
    spacingScale: number; // 1.0 default
};

export type TemplateColors = {
    background: string;
    heading: string;
    storyText: string;
    tracing: string;
    writingLine: string;
    border: string;
    accent: string;
    pageNumber: string;
};

export type TemplateFonts = {
    heading: string;
    body: string;
    tracing: string;
};

export type TemplateConfig = {
    id: string;
    name: string;
    fonts: TemplateFonts;
    colors: TemplateColors;
    layout: {
        borderStyle: 'none' | 'solid' | 'dashed' | 'double' | 'fancy';
        cornerRadius: number;
        showIcon: boolean;
        iconSet?: 'stars' | 'leaves' | 'hearts' | 'geometric';
        headingSize: number;
        bodySize: number;
    };
};

export type Scene = {
    id: string;
    title: string;
    story: string; // Plain text story
    words: string[]; // List of words to trace
    illustration: string | null; // Data URL or Image URL
    illustrationFit: 'cover' | 'contain';
    illustrationScale?: number; // Manual scale (zoom)
    illustrationPositionX?: number; // Offset X in %
    illustrationPositionY?: number; // Offset Y in %
};

export type FrontMatterType = 'title' | 'copyright' | 'dedication' | 'about' | 'usage' | 'parents' | 'toc' | 'custom';

export type PageContent = {
    id: string;
    type: FrontMatterType;
    title: string;
    text: string; // Rich text or plain text
    image: string | null;
    imagePlacement: 'top' | 'center' | 'bottom';
    includeInToc: boolean;
};

export type ProjectState = {
    id: string;
    name: string;
    lastModified: number;

    scenes: Scene[];
    frontMatter: PageContent[];
    endingPages: PageContent[];

    printSettings: PrintSettings;
    writingSettings: WritingPracticeSettings;
    template: TemplateConfig;

    // UI State (maybe separate store, but keeping here for save/load is easier)
    activeSection: string;
    validationErrors: ValidationError[];
};

export type ValidationError = {
    sectionId: string;
    message: string;
    severity: 'error' | 'warning';
};
