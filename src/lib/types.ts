export interface PageSpec {
  trimWidth: number;
  trimHeight: number;
  bleed: {
    top: number;
    bottom: number;
    outer: number;
    inner: number;
  };
  margins: {
    top: number;
    bottom: number;
    inside: number;
    outside: number;
  };
}

export interface Word {
  id: number;
  word: string;
}

export interface WordPlacement extends Word {
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down';
}

export interface PuzzleData {
  grid: (string | null)[][];
  words: WordPlacement[];
  unplacedWords: string[];
}

export type LayoutMode = 'words-on-top' | 'puzzle-on-top';

export interface BorderStyle {
  width: number; // in mm
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'none';
  radius: number; // in mm
}

export interface BoxStyle {
  border: BorderStyle;
  padding: number; // in mm
  fillColor?: string;
}

export interface TextStyle {
  fontFamily: string; // 'helvetica', 'courier', 'times', or custom font name
  fontSize: number; // pt
  color: string;
  lineHeight: number;
  alignment: 'left' | 'center' | 'right';
}

export interface PageNumberConfig {
  position: 'bottom-center' | 'bottom-outer' | 'top-center' | 'top-outer';
  style: 'simple' | 'circle' | 'box' | 'pill' | 'capsule' | 'accent-bar' | 'brackets' | 'roman' | 'roman-caps' | 'elegant-dash' | 'modern-box';
  margin: number; // mm from edge
  textStyle: TextStyle;
  fillColor?: string; // Optional background fill color for the page number
}

export interface Template {
  id: string;
  name: string;
  description: string;

  layout: LayoutMode;

  background: {
    color: string;
    image?: string; // Optional background image
    opacity?: number;
  };

  contentBox: BoxStyle;
  gridBox: BoxStyle;
  wordBox: BoxStyle;

  typography: {
    title: TextStyle;
    description: TextStyle;
    gridLetters: TextStyle;
    wordListHeading: TextStyle;
    wordListItems: TextStyle;
  };

  pageNumber: PageNumberConfig;
  ornament?: {
    type: 'vintage-diamond';
    color: string;
    spacing: number; // vertical mm
  };
}
