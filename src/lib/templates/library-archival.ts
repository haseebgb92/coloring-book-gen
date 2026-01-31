import type { Template } from '../types';

export const libraryArchivalTemplate: Template = {
    id: 'library-archival-premium',
    name: '10 — Library Archival',
    description: 'Scholarly document grayscale look',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.4, color: '#333333', style: 'solid', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.3, color: '#333333', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Libre Baskerville', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Libre Baskerville', fontSize: 12, color: '#333333', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Libre Baskerville', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Libre Baskerville', fontSize: 11, color: '#333333', lineHeight: 1.4, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'roman',
        margin: 12,
        textStyle: { fontFamily: 'Libre Baskerville', fontSize: 9, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
