
import type { Template } from '../types';

export const popArtBubbleTemplate: Template = {
    id: 'pop-art-bubble',
    name: '32 — Pop Art Bubble',
    description: 'Vibrant comic-style layout with bold primary colors and thick outlines',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 3, color: '#000000', style: 'solid', radius: 15 },
        padding: 15,
        fillColor: '#F5F5F5',
    },
    gridBox: { border: { width: 2, color: '#000000', style: 'solid', radius: 10 }, padding: 5, fillColor: '#ffffff' },
    wordBox: { border: { width: 2, color: '#000000', style: 'solid', radius: 20 }, padding: 12, fillColor: '#FFEB3B' },
    typography: {
        title: { fontFamily: 'Luckiest Guy', fontSize: 38, color: '#E91E63', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Bangers', fontSize: 16, color: '#2196F3', lineHeight: 1.2, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 15, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Luckiest Guy', fontSize: 20, color: '#000000', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Bangers', fontSize: 15, color: '#000000', lineHeight: 1.4, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'pill',
        margin: 15,
        fillColor: '#E91E63',
        textStyle: { fontFamily: 'Luckiest Guy', fontSize: 12, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
