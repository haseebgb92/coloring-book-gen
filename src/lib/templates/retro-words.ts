import type { Template } from '../types';

export const retroWordsTemplate: Template = {
    id: 'retro-words-premium',
    name: '21 — Retro Words Exclusive',
    description: 'Elite vintage editorial layout with custom dividers and fancy containers',
    layout: 'words-on-top',
    background: { color: '#e8e8e8', image: '/retro-bg.png' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 12,
        fillColor: 'transparent',
    },
    gridBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0.8, color: '#666666', style: 'solid', radius: 10 }, padding: 8, fillColor: '#ffffff' },
    typography: {
        title: { fontFamily: 'Alfa Slab One', fontSize: 36, color: '#000000', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 12, color: '#666666', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Alfa Slab One', fontSize: 15, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 12, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'top-center',
        style: 'capsule',
        margin: 10,
        fillColor: '#dcdcdc',
        textStyle: { fontFamily: 'Libre Baskerville', fontSize: 11, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
    ornament: {
        type: 'vintage-diamond',
        color: '#777777',
        spacing: 12
    }
};
