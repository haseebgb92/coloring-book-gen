import type { Template } from '../types';

export const cardStackTemplate: Template = {
    id: 'card-stack-premium',
    name: '14 — Card-Stack Boxes',
    description: 'Organized grayscale "cards" layout',
    layout: 'puzzle-on-top',
    background: { color: '#f0f0f0' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.5, color: '#d1d1d1', style: 'solid', radius: 8 }, padding: 10, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.5, color: '#d1d1d1', style: 'solid', radius: 8 }, padding: 10, fillColor: '#ffffff' },
    typography: {
        title: { fontFamily: 'Poppins', fontSize: 24, color: '#1a1a1a', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Noto Sans', fontSize: 12, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Fira Mono', fontSize: 14, color: '#1a1a1a', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Poppins', fontSize: 18, color: '#1a1a1a', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Noto Sans', fontSize: 12, color: '#1a1a1a', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 8,
        textStyle: { fontFamily: 'Poppins', fontSize: 10, color: '#1a1a1a', lineHeight: 1, alignment: 'center' },
    },
};
