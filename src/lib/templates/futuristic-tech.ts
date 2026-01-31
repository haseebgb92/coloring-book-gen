
import type { Template } from '../types';

export const futuristicTechTemplate: Template = {
    id: 'futuristic-tech',
    name: '34 — Futuristic Tech',
    description: 'Clean, high-tech interface layout with monospaced precision',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.5, color: '#2196F3', style: 'solid', radius: 10 },
        padding: 15,
        fillColor: '#F0F7FF',
    },
    gridBox: { border: { width: 1, color: '#1A237E', style: 'solid', radius: 4 }, padding: 10, fillColor: '#ffffff' },
    wordBox: { border: { width: 0.5, color: '#1A237E', style: 'dashed', radius: 2 }, padding: 8 },
    typography: {
        title: { fontFamily: 'Michroma', fontSize: 24, color: '#1A237E', lineHeight: 1.1, alignment: 'left' },
        description: { fontFamily: 'Ubuntu Mono', fontSize: 11, color: '#3F51B5', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Ubuntu Mono', fontSize: 14, color: '#1A237E', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Michroma', fontSize: 14, color: '#1A237E', lineHeight: 1.5, alignment: 'left' },
        wordListItems: { fontFamily: 'Ubuntu Mono', fontSize: 11, color: '#1A237E', lineHeight: 1.4, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-outer',
        style: 'modern-box',
        margin: 15,
        fillColor: '#1A237E',
        textStyle: { fontFamily: 'Michroma', fontSize: 9, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
