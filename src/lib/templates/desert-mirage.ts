
import type { Template } from '../types';

export const desertMirageTemplate: Template = {
    id: 'desert-mirage',
    name: '38 — Desert Mirage',
    description: 'Warm, arid layout with geometric tribal patterns and sandy colors',
    layout: 'words-on-top',
    background: { color: '#FFF3E0' },
    contentBox: {
        border: { width: 2, color: '#E65100', style: 'solid', radius: 0 },
        padding: 15,
        fillColor: '#FFE0B2',
    },
    gridBox: { border: { width: 1, color: '#BF360C', style: 'solid', radius: 4 }, padding: 10, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.5, color: '#EF6C00', style: 'dashed', radius: 0 }, padding: 8, fillColor: '#FFFDE7' },
    typography: {
        title: { fontFamily: 'Patua One', fontSize: 36, color: '#BF360C', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Karla', fontSize: 12, color: '#E65100', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Patua One', fontSize: 13, color: '#3E2723', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Patua One', fontSize: 18, color: '#BF360C', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Karla', fontSize: 12, color: '#3E2723', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'modern-box',
        margin: 12,
        fillColor: '#BF360C',
        textStyle: { fontFamily: 'Patua One', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
