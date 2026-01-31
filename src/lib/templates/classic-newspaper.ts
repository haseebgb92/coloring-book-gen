import type { Template } from '../types';

export const classicNewspaperTemplate: Template = {
    id: 'classic-newspaper-premium',
    name: '03 — Classic Newspaper',
    description: 'Modeled after vintage newspaper pages',
    layout: 'words-on-top',
    background: { color: '#f2f2f2' },
    contentBox: {
        border: { width: 1.2, color: '#000000', style: 'solid', radius: 0 },
        padding: 10,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.8, color: '#000000', style: 'solid', radius: 0 }, padding: 2 },
    wordBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Cormorant Garamond', fontSize: 24, color: '#000000', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Source Serif Pro', fontSize: 11, color: '#1a1a1a', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'JetBrains Mono', fontSize: 11, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Cormorant Garamond', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Source Serif Pro', fontSize: 11, color: '#1a1a1a', lineHeight: 1.4, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'roman-caps',
        margin: 12,
        textStyle: { fontFamily: 'Cormorant Garamond', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
