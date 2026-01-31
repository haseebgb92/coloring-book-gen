import type { Template } from '../types';

export const roundedTemplate: Template = {
    id: 'rounded',
    name: 'Soft & Rounded',
    description: 'Friendly look with rounded corners',
    layout: 'puzzle-on-top',
    background: { color: '#FFFFFF' },
    contentBox: {
        border: { width: 0.5, color: '#555555', style: 'solid', radius: 10 },
        padding: 15,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.5, color: '#888888', style: 'dashed', radius: 5 }, padding: 3 },
    wordBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Poppins', fontSize: 26, color: '#222222', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'helvetica', fontSize: 12, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'helvetica', fontSize: 15, color: '#222222', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'helvetica', fontSize: 18, color: '#222222', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'helvetica', fontSize: 13, color: '#444444', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 8,
        textStyle: { fontFamily: 'helvetica', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
