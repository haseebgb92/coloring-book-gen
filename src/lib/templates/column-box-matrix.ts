import type { Template } from '../types';

export const columnBoxMatrixTemplate: Template = {
    id: 'column-box-matrix-premium',
    name: '17 — Column Box Matrix',
    description: 'Label-swatch modular look',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.4, color: '#555555', style: 'solid', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.6, color: '#222222', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0.3, color: '#888888', style: 'dotted', radius: 2 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Merriweather', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'PT Sans', fontSize: 12, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'PT Sans', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'PT Sans', fontSize: 11, color: '#222222', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'brackets',
        margin: 12,
        textStyle: { fontFamily: 'PT Sans', fontSize: 10, color: '#222222', lineHeight: 1, alignment: 'center' },
    },
};
