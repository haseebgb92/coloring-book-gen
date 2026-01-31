import type { Template } from '../types';

export const classroomChalkboardTemplate: Template = {
    id: 'classroom-chalkboard-premium',
    name: '04 — Classroom Chalkboard',
    description: 'Friendly worksheet style for educators',
    layout: 'words-on-top',
    background: { color: '#f0f0f0' },
    contentBox: {
        border: { width: 0.8, color: '#333333', style: 'solid', radius: 4 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.5, color: '#333333', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0.8, color: '#333333', style: 'dashed', radius: 2 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Poppins', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Noto Sans', fontSize: 11, color: '#666666', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Fira Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Poppins', fontSize: 14, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Noto Sans', fontSize: 12, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'brackets',
        margin: 8,
        textStyle: { fontFamily: 'Poppins', fontSize: 10, color: '#333333', lineHeight: 1, alignment: 'center' },
    },
};
