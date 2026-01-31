
import type { Template } from '../types';

export const scientificJournalTemplate: Template = {
    id: 'scientific-journal',
    name: '31 — Scientific Journal',
    description: 'Structured academic layout with classic serifs and vertical dividers',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.8, color: '#000000', style: 'solid', radius: 0 },
        padding: 20,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.4, color: '#000000', style: 'solid', radius: 0 }, padding: 8 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 10, fillColor: '#F8F9FA' },
    typography: {
        title: { fontFamily: 'Crimson Text', fontSize: 28, color: '#000000', lineHeight: 1.1, alignment: 'left' },
        description: { fontFamily: 'Roboto Slab', fontSize: 10, color: '#444444', lineHeight: 1.6, alignment: 'left' },
        gridLetters: { fontFamily: 'Roboto Slab', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Crimson Text', fontSize: 14, color: '#000000', lineHeight: 1.8, alignment: 'left' },
        wordListItems: { fontFamily: 'Roboto Slab', fontSize: 10, color: '#333333', lineHeight: 1.6, alignment: 'left' },
    },
    pageNumber: {
        position: 'top-outer',
        style: 'modern-box',
        margin: 18,
        fillColor: '#000000',
        textStyle: { fontFamily: 'Crimson Text', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
