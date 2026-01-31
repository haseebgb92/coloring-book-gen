import type { Template } from '../types';

export const magazineGridTemplate: Template = {
    id: 'magazine-grid-premium',
    name: '05 — Magazine Grid',
    description: 'Editorial layout with bold headers',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 2.5, color: '#000000', style: 'solid', radius: 0 }, padding: 5 },
    wordBox: { border: { width: 1, color: '#000000', style: 'solid', radius: 0 }, padding: 6 },
    typography: {
        title: { fontFamily: 'Bebas Neue', fontSize: 32, color: '#000000', lineHeight: 1.1, alignment: 'left' },
        description: { fontFamily: 'Mulish', fontSize: 14, color: '#444444', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Cousine', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Bebas Neue', fontSize: 15, color: '#000000', lineHeight: 1.2, alignment: 'left' },
        wordListItems: { fontFamily: 'Mulish', fontSize: 11, color: '#333333', lineHeight: 1.5, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 10,
        textStyle: { fontFamily: 'Mulish', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
