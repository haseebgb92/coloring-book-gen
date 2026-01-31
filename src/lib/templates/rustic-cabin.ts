
import type { Template } from '../types';

export const rusticCabinTemplate: Template = {
    id: 'rustic-cabin',
    name: '33 — Rustic Cabin',
    description: 'Earthy and cozy layout with slab serifs and natural tones',
    layout: 'words-on-top',
    background: { color: '#EFEBE9' },
    contentBox: {
        border: { width: 2, color: '#4E342E', style: 'solid', radius: 4 },
        padding: 20,
        fillColor: '#D7CCC8',
    },
    gridBox: { border: { width: 1, color: '#4E342E', style: 'solid', radius: 0 }, padding: 8, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.5, color: '#4E342E', style: 'dashed', radius: 8 }, padding: 10, fillColor: '#EFEBE9' },
    typography: {
        title: { fontFamily: 'Arvo', fontSize: 28, color: '#3E2723', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Bitter', fontSize: 12, color: '#5D4037', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Bitter', fontSize: 13, color: '#212121', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Arvo', fontSize: 16, color: '#3E2723', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Bitter', fontSize: 12, color: '#3E2723', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'capsule',
        margin: 15,
        fillColor: '#4E342E',
        textStyle: { fontFamily: 'Arvo', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
