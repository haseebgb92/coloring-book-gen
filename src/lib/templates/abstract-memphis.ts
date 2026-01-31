
import type { Template } from '../types';

export const abstractMemphisTemplate: Template = {
    id: 'abstract-memphis',
    name: '48 — Abstract Memphis 80s',
    description: 'Playful 80s-inspired layout with bold geometric shapes and vibrant colors',
    layout: 'words-on-top',
    background: { color: '#FFDEE9' },
    contentBox: {
        border: { width: 4, color: '#FFD700', style: 'solid', radius: 40 },
        padding: 24,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 3, color: '#333333', style: 'solid', radius: 0 }, padding: 12, fillColor: '#B5FFFC' },
    wordBox: { border: { width: 3, color: '#FF4081', style: 'solid', radius: 0 }, padding: 14, fillColor: '#FFFF00' },
    typography: {
        title: { fontFamily: 'Monoton', fontSize: 38, color: '#333333', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Fredoka One', fontSize: 13, color: '#333333', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Fredoka One', fontSize: 16, color: '#333333', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Fredoka One', fontSize: 18, color: '#FF4081', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Fredoka One', fontSize: 14, color: '#333333', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'capsule',
        margin: 15,
        fillColor: '#FFD700',
        textStyle: { fontFamily: 'Fredoka One', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
