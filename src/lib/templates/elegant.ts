import type { Template } from '../types';

export const elegantTemplate: Template = {
    id: 'elegant',
    name: 'Elegant Serif',
    description: 'Sophisticated style with serif fonts',
    layout: 'words-on-top',
    background: { color: '#FFFFFF' },
    contentBox: {
        border: { width: 0.3, color: '#333333', style: 'solid', radius: 0 },
        padding: 12,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 0 },
    wordBox: { border: { width: 0, color: '#000000', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Lora', fontSize: 30, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Merriweather', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'helvetica', fontSize: 16, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lora', fontSize: 18, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Merriweather', fontSize: 13, color: '#333333', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'accent-bar',
        margin: 12,
        textStyle: { fontFamily: 'Lora', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
