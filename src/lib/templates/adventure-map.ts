
import type { Template } from '../types';

export const adventureMapTemplate: Template = {
    id: 'adventure-map',
    name: '30 — Adventure Map',
    description: 'Nautical explorer layout with typewriter fonts and dashed map lines',
    layout: 'puzzle-on-top',
    background: { color: '#F4ECD8' },
    contentBox: {
        border: { width: 1.2, color: '#5D4037', style: 'dashed', radius: 2 },
        padding: 18,
        fillColor: '#FDF5E6',
    },
    gridBox: { border: { width: 0.6, color: '#5D4037', style: 'solid', radius: 0 }, padding: 5, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.6, color: '#8D6E63', style: 'dotted', radius: 5 }, padding: 12, fillColor: '#FDF5E6' },
    typography: {
        title: { fontFamily: 'Special Elite', fontSize: 30, color: '#3E2723', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Courier Prime', fontSize: 13, color: '#5D4037', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Courier Prime', fontSize: 14, color: '#212121', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Special Elite', fontSize: 16, color: '#3E2723', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Courier Prime', fontSize: 12, color: '#3E2723', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'brackets',
        margin: 15,
        textStyle: { fontFamily: 'Special Elite', fontSize: 11, color: '#5D4037', lineHeight: 1, alignment: 'center' },
    },
};
