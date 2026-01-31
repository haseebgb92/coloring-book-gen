
import type { Template } from '../types';

export const neonCityscapeTemplate: Template = {
    id: 'neon-cityscape',
    name: '45 — Neon Cityscape',
    description: 'Vibrant violet and electric blue layout with retro-futuristic vibes',
    layout: 'puzzle-on-top',
    background: { color: '#1A0B2E' },
    contentBox: {
        border: { width: 3, color: '#FF00FF', style: 'solid', radius: 8 },
        padding: 20,
        fillColor: '#240B36',
    },
    gridBox: { border: { width: 1.2, color: '#00FFFF', style: 'solid', radius: 4 }, padding: 8, fillColor: '#1A0B2E' },
    wordBox: { border: { width: 1, color: '#FF00FF', style: 'dashed', radius: 0 }, padding: 10, fillColor: '#2E004D' },
    typography: {
        title: { fontFamily: 'Audiowide', fontSize: 34, color: '#00FFFF', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 13, color: '#E0E0E0', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 13, color: '#FFFFFF', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Audiowide', fontSize: 16, color: '#FF00FF', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 13, color: '#B6FFFA', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'capsule',
        margin: 15,
        fillColor: '#00FFFF',
        textStyle: { fontFamily: 'Audiowide', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
