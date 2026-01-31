
import type { Template } from '../types';

export const arcticFrostTemplate: Template = {
    id: 'arctic-frost',
    name: '46 — Arctic Frost',
    description: 'Crisp ice-blue layout with sharp modern typography and airy spacing',
    layout: 'words-on-top',
    background: { color: '#E1F5FE' },
    contentBox: {
        border: { width: 1, color: '#B3E5FC', style: 'solid', radius: 4 },
        padding: 22,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.5, color: '#81D4FA', style: 'solid', radius: 0 }, padding: 10, fillColor: '#F8FDFF' },
    wordBox: { border: { width: 1.5, color: '#4FC3F7', style: 'solid', radius: 0 }, padding: 12, fillColor: '#E1F5FE' },
    typography: {
        title: { fontFamily: 'Outfit', fontSize: 36, color: '#01579B', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Inter', fontSize: 13, color: '#0288D1', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Outfit', fontSize: 14, color: '#01579B', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Outfit', fontSize: 18, color: '#0288D1', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Inter', fontSize: 13, color: '#01579B', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'top-outer',
        style: 'modern-box',
        margin: 15,
        fillColor: '#0288D1',
        textStyle: { fontFamily: 'Outfit', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
