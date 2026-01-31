
import type { Template } from '../types';

export const paperScrapbookTemplate: Template = {
    id: 'paper-scrapbook',
    name: '44 — Paper Scrapbook',
    description: 'Handcrafted look with torn paper effects, tape accents and handwriting',
    layout: 'words-on-top',
    background: { color: '#F4EAD5' },
    contentBox: {
        border: { width: 1.5, color: '#A68B6D', style: 'dashed', radius: 2 },
        padding: 15,
        fillColor: '#FDFCF0',
    },
    gridBox: { border: { width: 2, color: '#C1A17E', style: 'solid', radius: 4 }, padding: 10, fillColor: '#ffffff' },
    wordBox: { border: { width: 1.2, color: '#8D7B68', style: 'solid', radius: 10 }, padding: 12, fillColor: '#FFFDE7' },
    typography: {
        title: { fontFamily: 'Homemade Apple', fontSize: 28, color: '#3E2723', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Indie Flower', fontSize: 13, color: '#5D4037', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: ' couvrir Courier New', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Indie Flower', fontSize: 18, color: '#3E2723', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Indie Flower', fontSize: 13, color: '#2D2424', lineHeight: 1.4, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'brackets',
        margin: 12,
        textStyle: { fontFamily: 'Indie Flower', fontSize: 12, color: '#3E2723', lineHeight: 1, alignment: 'center' },
    },
};
