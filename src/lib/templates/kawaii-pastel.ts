
import type { Template } from '../types';

export const kawaiiPastelTemplate: Template = {
    id: 'kawaii-pastel',
    name: '41 — Kawaii Pastel',
    description: 'Soft pastel layout with adorable rounded typography and playful colors',
    layout: 'puzzle-on-top',
    background: { color: '#FFF0F5' },
    contentBox: {
        border: { width: 3, color: '#FFB6C1', style: 'dashed', radius: 30 },
        padding: 20,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 2, color: '#ADD8E6', style: 'solid', radius: 15 }, padding: 10, fillColor: '#F0FFFF' },
    wordBox: { border: { width: 2, color: '#E6E6FA', style: 'solid', radius: 25 }, padding: 12, fillColor: '#FFF9C4' },
    typography: {
        title: { fontFamily: 'Sniglet', fontSize: 36, color: '#FF69B4', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Varela Round', fontSize: 13, color: '#87CEEB', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Varela Round', fontSize: 15, color: '#444444', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Sniglet', fontSize: 18, color: '#BA55D3', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Varela Round', fontSize: 13, color: '#2F4F4F', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'pill',
        margin: 15,
        fillColor: '#FF69B4',
        textStyle: { fontFamily: 'Sniglet', fontSize: 12, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
