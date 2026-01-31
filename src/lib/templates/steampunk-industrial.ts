
import type { Template } from '../types';

export const steampunkIndustrialTemplate: Template = {
    id: 'steampunk-industrial',
    name: '40 — Steampunk Industrial',
    description: 'Metallic, brass-inspired layout with Victorian industrial typography',
    layout: 'words-on-top',
    background: { color: '#E0C097' },
    contentBox: {
        border: { width: 3, color: '#5C3D2E', style: 'solid', radius: 0 },
        padding: 18,
        fillColor: '#FCF8E8',
    },
    gridBox: { border: { width: 1.5, color: '#2D2424', style: 'solid', radius: 0 }, padding: 4, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.8, color: '#5C3D2E', style: 'dashed', radius: 4 }, padding: 12, fillColor: '#E0C097' },
    typography: {
        title: { fontFamily: 'Rye', fontSize: 34, color: '#2D2424', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Special Elite', fontSize: 13, color: '#5C3D2E', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Special Elite', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Rye', fontSize: 16, color: '#5C3D2E', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Special Elite', fontSize: 12, color: '#2D2424', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'roman-caps',
        margin: 15,
        textStyle: { fontFamily: 'Rye', fontSize: 10, color: '#5C3D2E', lineHeight: 1, alignment: 'center' },
    },
};
