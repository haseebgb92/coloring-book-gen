
import type { Template } from '../types';

export const artDecoGlamourTemplate: Template = {
    id: 'art-deco-glamour',
    name: '28 — Art Deco Glamour',
    description: '1920s sophisticated geometric design with gold and charcoal tones',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1.5, color: '#2C3E50', style: 'solid', radius: 0 },
        padding: 20,
        fillColor: '#FDFCF0',
    },
    gridBox: { border: { width: 0.8, color: '#A67C00', style: 'solid', radius: 0 }, padding: 10, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.5, color: '#2C3E50', style: 'solid', radius: 0 }, padding: 10 },
    typography: {
        title: { fontFamily: 'Abril Fatface', fontSize: 32, color: '#A67C00', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Josefin Sans', fontSize: 12, color: '#2C3E50', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Josefin Sans', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Abril Fatface', fontSize: 18, color: '#2C3E50', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Josefin Sans', fontSize: 12, color: '#000000', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'top-center',
        style: 'elegant-dash',
        margin: 15,
        textStyle: { fontFamily: 'Abril Fatface', fontSize: 10, color: '#A67C00', lineHeight: 1, alignment: 'center' },
    },
};
