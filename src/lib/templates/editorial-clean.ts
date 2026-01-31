
import type { Template } from '../types';

export const editorialCleanTemplate: Template = {
    id: 'editorial-clean',
    name: '24 — Editorial Clean',
    description: 'Structured, newspaper-inspired layout with focus on readability',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 24,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.8, color: '#333333', style: 'solid', radius: 0 }, padding: 6 },
    wordBox: { border: { width: 1, color: '#dddddd', style: 'solid', radius: 0 }, padding: 12, fillColor: '#f9f9f9' },
    typography: {
        title: { fontFamily: 'Oswald', fontSize: 30, color: '#000000', lineHeight: 1.1, alignment: 'left' },
        description: { fontFamily: 'Lato', fontSize: 11, color: '#555555', lineHeight: 1.5, alignment: 'left' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 13, color: '#111111', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Oswald', fontSize: 14, color: '#000000', lineHeight: 1.6, alignment: 'left' },
        wordListItems: { fontFamily: 'Lato', fontSize: 11, color: '#333333', lineHeight: 1.6, alignment: 'left' },
    },
    pageNumber: {
        position: 'top-outer',
        style: 'modern-box',
        margin: 18,
        fillColor: '#000000',
        textStyle: { fontFamily: 'Oswald', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
