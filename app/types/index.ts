export type TrimSize = '6x9' | '8x10' | '8.5x11';

export interface Story {
    order: number;
    title: string;
    story_text: string;
    writing_words: string[];
    lesson?: string;
    image_path?: string;
    image_file?: File;
}

export interface KDPConfig {
    trimSize: TrimSize;
    hasBleed: boolean;
    margins: {
        inner: number;
        outer: number;
        top: number;
        bottom: number;
        safeZone: number;
    };
}

export interface Template {
    id: string;
    name: string;
    fontFamily: string;
    headingSize: 'S' | 'M' | 'L';
    bodySize: 'S' | 'M' | 'L';
    hasBorder: boolean;
    pageNumbers: boolean;
    imageFit: 'contain' | 'cover';
}

export interface ProjectState {
    title: string;
    config: KDPConfig;
    stories: Story[];
    template: Template;
    frontMatter: string[]; // IDs of selected pages
    endMatter: string[]; // IDs of selected pages
}
