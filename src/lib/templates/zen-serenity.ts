
import type { Template } from '../types';

export const zenSerenityTemplate: Template = {
    id: 'zen-serenity',
    name: '29 — Zen Serenity',
    description: 'Ultra-minimalist layout with ample white space and soft typography',
    layout: 'words-on-top',
    background: { color: '#FAFAFA' },
    contentBox: {
        border: { width: 0.2, color: '#D1D1D1', style: 'solid', radius: 0 },
        padding: 30,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 15 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Lora', fontSize: 26, color: '#333333', lineHeight: 1.5, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 10, color: '#888888', lineHeight: 1.8, alignment: 'center' },
        gridLetters: { fontFamily: 'Montserrat', fontSize: 13, color: '#444444', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lora', fontSize: 14, color: '#555555', lineHeight: 2, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 10, color: '#666666', lineHeight: 2, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 20,
        textStyle: { fontFamily: 'Lora', fontSize: 9, color: '#999999', lineHeight: 1, alignment: 'center' },
    },
};
