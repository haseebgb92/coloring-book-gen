
import type { Template } from '../types';

export const kidsFunPopTemplate: Template = {
    id: 'kids-fun-pop',
    name: '23 — Kids Fun Pop',
    description: 'Playful, bold, and colorful layout perfect for children books',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 3, color: '#000000', style: 'dashed', radius: 24 },
        padding: 20,
        fillColor: '#FAFAFA',
    },
    gridBox: { border: { width: 2, color: '#333333', style: 'solid', radius: 12 }, padding: 8, fillColor: '#ffffff' },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 10, fillColor: '#FFFDE7' },
    typography: {
        title: { fontFamily: 'Fredoka One', fontSize: 36, color: '#FF4081', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Balsamiq Sans', fontSize: 14, color: '#311B92', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Varela Round', fontSize: 16, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Fredoka One', fontSize: 18, color: '#009688', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Balsamiq Sans', fontSize: 14, color: '#333333', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'circle',
        margin: 15,
        fillColor: '#304FFE',
        textStyle: { fontFamily: 'Fredoka One', fontSize: 12, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
