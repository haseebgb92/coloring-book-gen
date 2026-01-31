
import type { Template } from '../types';

export const autumnSpiritTemplate: Template = {
    id: 'autumn-spirit',
    name: '47 — Autumn Spirit',
    description: 'Cozy seasonal layout with warm harvest tones and elegant serif fonts',
    layout: 'puzzle-on-top',
    background: { color: '#FFF3E0' },
    contentBox: {
        border: { width: 1.5, color: '#BF360C', style: 'solid', radius: 10 },
        padding: 20,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 1, color: '#D84315', style: 'dashed', radius: 4 }, padding: 8, fillColor: '#FFF8E1' },
    wordBox: { border: { width: 1, color: '#8D6E63', style: 'solid', radius: 0 }, padding: 10, fillColor: '#FBE9E7' },
    typography: {
        title: { fontFamily: 'Lustria', fontSize: 36, color: '#3E2723', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Lora', fontSize: 13, color: '#5D4037', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Lustria', fontSize: 13, color: '#3E2723', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lustria', fontSize: 18, color: '#D84315', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Lora', fontSize: 13, color: '#3E2723', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 15,
        fillColor: '#BF360C',
        textStyle: { fontFamily: 'Lustria', fontSize: 11, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
