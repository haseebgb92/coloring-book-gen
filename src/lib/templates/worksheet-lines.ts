import type { Template } from '../types';

export const worksheetLinesTemplate: Template = {
    id: 'worksheet-lines-premium',
    name: '19 — Worksheet Lines',
    description: 'Educational fill-in-the-blank style',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.7, color: '#000000', style: 'solid', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.4, color: '#000000', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Libre Baskerville', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Nunito', fontSize: 12, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Space Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Nunito', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Nunito', fontSize: 12, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'elegant-dash',
        margin: 12,
        textStyle: { fontFamily: 'Libre Baskerville', fontSize: 9, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
