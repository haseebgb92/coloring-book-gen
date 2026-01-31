
import type { Template } from '../types';

export const gothicVictorianTemplate: Template = {
    id: 'gothic-victorian',
    name: '35 — Gothic Victorian',
    description: 'Dark and ornate layout with classic serif fonts and heavy borders',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1.5, color: '#1A1A1A', style: 'solid', radius: 0 },
        padding: 22,
        fillColor: '#F5F5F5',
    },
    gridBox: { border: { width: 0.8, color: '#000000', style: 'solid', radius: 0 }, padding: 6, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.4, color: '#000000', style: 'dotted', radius: 0 }, padding: 12, fillColor: '#ffffff' },
    typography: {
        title: { fontFamily: 'Old Standard TT', fontSize: 30, color: '#1A1A1A', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Cinzel', fontSize: 11, color: '#333333', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Old Standard TT', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Cinzel', fontSize: 15, color: '#1A1A1A', lineHeight: 1.4, alignment: 'center' },
        wordListItems: { fontFamily: 'Old Standard TT', fontSize: 12, color: '#000000', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'roman-caps',
        margin: 15,
        textStyle: { fontFamily: 'Cinzel', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
