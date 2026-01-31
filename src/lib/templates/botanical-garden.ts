
import type { Template } from '../types';

export const botanicalGardenTemplate: Template = {
    id: 'botanical-garden',
    name: '25 — Botanical Garden',
    description: 'Elegant organic look with soft serifs and spacious margins',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.5, color: '#2D5A27', style: 'solid', radius: 15 },
        padding: 25,
        fillColor: '#FDFDF5',
    },
    gridBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Lora', fontSize: 28, color: '#2D5A27', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Lora', fontSize: 11, color: '#4A6741', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Lora', fontSize: 13, color: '#1A1A1A', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lora', fontSize: 16, color: '#2D5A27', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Lora', fontSize: 11, color: '#1A1A1A', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'capsule',
        margin: 15,
        fillColor: '#2D5A27',
        textStyle: { fontFamily: 'Lora', fontSize: 9, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
