import type { Template } from '../types';

export const horizontalDividerTemplate: Template = {
    id: 'horizontal-divider-premium',
    name: '13 — Horizontal Divider Lines',
    description: 'Clean single-column word list rules',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.6, color: '#000000', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Cormorant Garamond', fontSize: 26, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Source Sans Pro', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Source Sans Pro', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Source Sans Pro', fontSize: 12, color: '#111111', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 12,
        textStyle: { fontFamily: 'Source Sans Pro', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
