export interface Story {
    order: number;
    title: string;
    story_text: string;
    writing_words: string[];
    lesson?: string;
    illustration?: string; // File path or data URL
}

export interface KDPConfig {
    trimSize: TrimSize;
    hasBleed: boolean;
    margins: {
        top: number;
        bottom: number;
        outer: number;
        inner: number;
    };
}

export type TrimSize = '6x9' | '8x10' | '8.5x11';

export interface Template {
    id: string;
    name: string;
    fontFamily: string;
    fontSize: number;
    hasBorder: boolean;
    imageFit: 'contain' | 'cover';
    pageNumbers: boolean;
    headingSize: 'S' | 'M' | 'L';
}

export interface ProjectState {
    title: string;
    config: KDPConfig;
    stories: Story[];
    template: Template;
    frontMatter: string[];
    endMatter: string[];
    logo?: string;
    customText?: Record<string, string>; // Map of pageType -> Custom Text
}
