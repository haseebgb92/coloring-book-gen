import type { Template } from '../types';

export const classicTemplate: Template = {
    id: 'classic',
    name: 'Classic Standard',
    description: 'Traditional look with clean black borders',
    layout: 'words-on-top',
    background: { color: '#FFFFFF' },
    contentBox: {
        border: { width: 0.5, color: '#000000', style: 'solid', radius: 0 },
        padding: 10,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.5, color: '#000000', style: 'solid', radius: 0 }, padding: 0 },
    wordBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 2 },
    typography: {
        title: { fontFamily: 'helvetica', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'helvetica', fontSize: 12, color: '#333333', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'helvetica', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'helvetica', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'helvetica', fontSize: 12, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 10,
        textStyle: { fontFamily: 'helvetica', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
