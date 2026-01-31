
import type { Template } from '../types';

export const minimalistZenArchTemplate: Template = {
    id: 'minimalist-zen-arch',
    name: '51 — Minimalist Zen Arch',
    description: 'Ultra-clean architectural layout with neutral grays and balanced white space',
    layout: 'puzzle-on-top',
    background: { color: '#F5F5F5' },
    contentBox: {
        border: { width: 1, color: '#E0E0E0', style: 'solid', radius: 2 },
        padding: 24,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.5, color: '#BDBDBD', style: 'solid', radius: 0 }, padding: 12 },
    wordBox: { border: { width: 0.5, color: '#9E9E9E', style: 'solid', radius: 4 }, padding: 16, fillColor: '#FAFAFA' },
    typography: {
        title: { fontFamily: 'Tenor Sans', fontSize: 34, color: '#212121', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Inter', fontSize: 13, color: '#757575', lineHeight: 1.6, alignment: 'center' },
        gridLetters: { fontFamily: 'Inter', fontSize: 13, color: '#212121', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Tenor Sans', fontSize: 16, color: '#424242', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Inter', fontSize: 12, color: '#616161', lineHeight: 1.7, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'elegant-dash',
        margin: 20,
        textStyle: { fontFamily: 'Tenor Sans', fontSize: 10, color: '#9E9E9E', lineHeight: 1, alignment: 'center' },
    },
};
