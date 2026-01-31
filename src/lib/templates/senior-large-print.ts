import type { Template } from '../types';

export const seniorLargePrintTemplate: Template = {
    id: 'senior-large-print-premium',
    name: '06 — Senior Large Print',
    description: 'Optimized for high readability',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 10,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 1, color: '#000000', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Oswald', fontSize: 32, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Open Sans', fontSize: 16, color: '#1a1a1a', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Ubuntu Mono', fontSize: 18, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Open Sans', fontSize: 20, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Open Sans', fontSize: 16, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 12,
        textStyle: { fontFamily: 'Open Sans', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
