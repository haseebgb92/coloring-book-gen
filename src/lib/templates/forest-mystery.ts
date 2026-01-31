
import type { Template } from '../types';

export const forestMysteryTemplate: Template = {
    id: 'forest-mystery',
    name: '37 — Forest Mystery',
    description: 'Deep organic greens and earthy browns with a classic serif touch',
    layout: 'puzzle-on-top',
    background: { color: '#F1F8E9' },
    contentBox: {
        border: { width: 1.2, color: '#1B5E20', style: 'solid', radius: 4 },
        padding: 22,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.8, color: '#33691E', style: 'solid', radius: 0 }, padding: 6 },
    wordBox: { border: { width: 0.6, color: '#4E342E', style: 'dotted', radius: 0 }, padding: 12, fillColor: '#F9FBE7' },
    typography: {
        title: { fontFamily: 'Crete Round', fontSize: 32, color: '#1B5E20', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'EB Garamond', fontSize: 13, color: '#2E7D32', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Crete Round', fontSize: 13, color: '#1B5E20', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Crete Round', fontSize: 16, color: '#33691E', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'EB Garamond', fontSize: 12, color: '#1B5E20', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'top-center',
        style: 'elegant-dash',
        margin: 15,
        textStyle: { fontFamily: 'Crete Round', fontSize: 10, color: '#1B5E20', lineHeight: 1, alignment: 'center' },
    },
};
