
import type { Template } from '../types';

export const oceanicVoyageTemplate: Template = {
    id: 'oceanic-voyage',
    name: '36 — Oceanic Voyage',
    description: 'Bubbly and fresh maritime layout with cool blue gradients',
    layout: 'words-on-top',
    background: { color: '#E0F7FA' },
    contentBox: {
        border: { width: 1.5, color: '#006064', style: 'solid', radius: 20 },
        padding: 20,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 1, color: '#00BCD4', style: 'solid', radius: 10 }, padding: 8, fillColor: '#F0FFFF' },
    wordBox: { border: { width: 0.8, color: '#0097A7', style: 'dashed', radius: 15 }, padding: 10, fillColor: '#B2EBF2' },
    typography: {
        title: { fontFamily: 'Baloo 2', fontSize: 34, color: '#006064', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Quicksand', fontSize: 13, color: '#00838F', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Fredoka', fontSize: 14, color: '#006064', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Baloo 2', fontSize: 18, color: '#006064', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Quicksand', fontSize: 13, color: '#006064', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 15,
        fillColor: '#006064',
        textStyle: { fontFamily: 'Baloo 2', fontSize: 11, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
