import type { Template } from '../types';

export const modernMinimalTemplate: Template = {
    id: 'modern-minimal-premium',
    name: '02 — Modern Minimal',
    description: 'Crisp editorial look with no borders',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.5, color: '#e0e0e0', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Montserrat', fontSize: 22, color: '#212529', lineHeight: 1.2, alignment: 'left' },
        description: { fontFamily: 'Inter', fontSize: 11, color: '#6c757d', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Inconsolata', fontSize: 12, color: '#212529', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Inter', fontSize: 13, color: '#495057', lineHeight: 1.2, alignment: 'left' },
        wordListItems: { fontFamily: 'Inter', fontSize: 12, color: '#495057', lineHeight: 1.6, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 10,
        textStyle: { fontFamily: 'Inter', fontSize: 9, color: '#adb5bd', lineHeight: 1, alignment: 'center' },
    },
};
