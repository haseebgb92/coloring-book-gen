
import type { Template } from '../types';

export const blueprintArchitectTemplate: Template = {
    id: 'blueprint-architect',
    name: '26 — Blueprint Architect',
    description: 'Technical drafting look with blueprint blue and mono fonts',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1, color: '#003366', style: 'solid', radius: 0 },
        padding: 20,
        fillColor: '#F0F7FF',
    },
    gridBox: { border: { width: 0.5, color: '#003366', style: 'solid', radius: 0 }, padding: 0 },
    wordBox: { border: { width: 0.5, color: '#003366', style: 'dashed', radius: 0 }, padding: 10 },
    typography: {
        title: { fontFamily: 'Space Mono', fontSize: 24, color: '#003366', lineHeight: 1.1, alignment: 'left' },
        description: { fontFamily: 'Space Mono', fontSize: 10, color: '#003366', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Space Mono', fontSize: 13, color: '#003366', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Space Mono', fontSize: 14, color: '#003366', lineHeight: 1.5, alignment: 'left' },
        wordListItems: { fontFamily: 'Space Mono', fontSize: 10, color: '#003366', lineHeight: 1.4, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'modern-box',
        margin: 15,
        fillColor: '#003366',
        textStyle: { fontFamily: 'Space Mono', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
