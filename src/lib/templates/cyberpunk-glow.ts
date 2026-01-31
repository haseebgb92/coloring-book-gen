
import type { Template } from '../types';

export const cyberpunkGlowTemplate: Template = {
    id: 'cyberpunk-glow',
    name: '42 — Cyberpunk Glow',
    description: 'Neon-infused futuristic layout with high contrast dark backgrounds',
    layout: 'words-on-top',
    background: { color: '#050505' },
    contentBox: {
        border: { width: 1.5, color: '#00FF9F', style: 'solid', radius: 4 },
        padding: 15,
        fillColor: '#0A0A0A',
    },
    gridBox: { border: { width: 0.8, color: '#FF0055', style: 'solid', radius: 0 }, padding: 10, fillColor: '#0C0C0C' },
    wordBox: { border: { width: 0.8, color: '#00D4FF', style: 'dashed', radius: 0 }, padding: 10, fillColor: '#111111' },
    typography: {
        title: { fontFamily: 'Orbitron', fontSize: 32, color: '#00FF9F', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Rajdhani', fontSize: 13, color: '#B0B0B0', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Rajdhani', fontSize: 13, color: '#FFFFFF', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Orbitron', fontSize: 15, color: '#FF0055', lineHeight: 1.6, alignment: 'center' },
        wordListItems: { fontFamily: 'Rajdhani', fontSize: 13, color: '#00D4FF', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 12,
        fillColor: '#FF0055',
        textStyle: { fontFamily: 'Orbitron', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
