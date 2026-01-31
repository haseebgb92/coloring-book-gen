import type { Template } from '../types';

export const modernTemplate: Template = {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Minimalist design without heavy borders',
    layout: 'puzzle-on-top',
    background: { color: '#FFFFFF' },
    contentBox: {
        border: { width: 0, color: '#000000', style: 'none', radius: 0 },
        padding: 15,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 0 },
    wordBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Montserrat', fontSize: 28, color: '#1a1a1a', lineHeight: 1.2, alignment: 'left' },
        description: { fontFamily: 'Inter', fontSize: 11, color: '#666666', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Inconsolata', fontSize: 15, color: '#1a1a1a', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Inter', fontSize: 14, color: '#1a1a1a', lineHeight: 1.2, alignment: 'left' },
        wordListItems: { fontFamily: 'Inter', fontSize: 11, color: '#444444', lineHeight: 1.6, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'simple',
        margin: 10,
        textStyle: { fontFamily: 'Inter', fontSize: 9, color: '#888888', lineHeight: 1, alignment: 'center' },
    },
};
