import type { Template } from '../types';

export const dividerBannerTemplate: Template = {
    id: 'divider-banner-premium',
    name: '18 — Divider Banner',
    description: 'Stylish Segmented contemporary look',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 1.5, color: '#1a1a1a', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0.4, color: '#1a1a1a', style: 'solid', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Bebas Neue', fontSize: 26, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Mulish', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Cousine', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Bebas Neue', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Mulish', fontSize: 11, color: '#1a1a1a', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'roman-caps',
        margin: 10,
        textStyle: { fontFamily: 'Bebas Neue', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
