
import type { Template } from '../types';

export const hollywoodPremiereTemplate: Template = {
    id: 'hollywood-premiere',
    name: '50 — Hollywood Premiere',
    description: 'Golden Age of Cinema layout with red velvet tones and marquee lighting',
    layout: 'words-on-top',
    background: { color: '#2D033B' },
    contentBox: {
        border: { width: 5, color: '#FFD700', style: 'solid', radius: 4 },
        padding: 24,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 1, color: '#C0C0C0', style: 'solid', radius: 0 }, padding: 8, fillColor: '#F5F5F5' },
    wordBox: { border: { width: 1.5, color: '#800000', style: 'solid', radius: 12 }, padding: 14, fillColor: '#FFF0F0' },
    typography: {
        title: { fontFamily: 'Fascinate Inline', fontSize: 38, color: '#800000', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Quicksand', fontSize: 13, color: '#333333', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Quicksand', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Fascinate', fontSize: 18, color: '#800000', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Quicksand', fontSize: 13, color: '#2D033B', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 15,
        fillColor: '#FFD700',
        textStyle: { fontFamily: 'Fascinate', fontSize: 12, color: '#800000', lineHeight: 1, alignment: 'center' },
    },
};
