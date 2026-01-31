
import type { Template } from '../types';

export const midnightCyberTemplate: Template = {
    id: 'midnight-cyber',
    name: '27 — Midnight Cyber',
    description: 'Dark, high-contrast digital look with neon accents',
    layout: 'words-on-top',
    background: { color: '#0A0A0F' },
    contentBox: {
        border: { width: 0.8, color: '#00F2FF', style: 'solid', radius: 4 },
        padding: 15,
        fillColor: '#12121A',
    },
    gridBox: { border: { width: 0.4, color: '#7000FF', style: 'solid', radius: 2 }, padding: 5, fillColor: '#1A1A24' },
    wordBox: { border: { width: 0.4, color: '#FF00E5', style: 'dashed', radius: 4 }, padding: 8, fillColor: '#1A1A24' },
    typography: {
        title: { fontFamily: 'Orbitron', fontSize: 28, color: '#00F2FF', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Exo 2', fontSize: 11, color: '#A0A0B0', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 13, color: '#FFFFFF', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Orbitron', fontSize: 14, color: '#FF00E5', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Exo 2', fontSize: 11, color: '#00F2FF', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 12,
        fillColor: '#00F2FF',
        textStyle: { fontFamily: 'Orbitron', fontSize: 9, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
