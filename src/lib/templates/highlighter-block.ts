import type { Template } from '../types';

export const highlighterBlockTemplate: Template = {
    id: 'highlighter-block-premium',
    name: '16 — Highlighter Block Header',
    description: 'High contrast header block',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 0,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 2, color: '#222222', style: 'solid', radius: 0 }, padding: 5 },
    wordBox: { border: { width: 0.5, color: '#e0e0e0', style: 'solid', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Oswald', fontSize: 28, color: '#000000', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Open Sans', fontSize: 12, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Ubuntu Mono', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Oswald', fontSize: 16, color: '#222222', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Open Sans', fontSize: 12, color: '#222222', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'accent-bar',
        margin: 10,
        textStyle: { fontFamily: 'Oswald', fontSize: 10, color: '#222222', lineHeight: 1, alignment: 'center' },
    },
};
