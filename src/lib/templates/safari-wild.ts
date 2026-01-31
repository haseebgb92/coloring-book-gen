
import type { Template } from '../types';

export const safariWildTemplate: Template = {
    id: 'safari-wild',
    name: '49 — Safari Wild',
    description: 'Adventure-fueled layout with jungle greens, earthy browns and bold type',
    layout: 'puzzle-on-top',
    background: { color: '#E8F5E9' },
    contentBox: {
        border: { width: 4, color: '#2E7D32', style: 'solid', radius: 0 },
        padding: 20,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 1.5, color: '#1B5E20', style: 'solid', radius: 4 }, padding: 8, fillColor: '#F1F8E9' },
    wordBox: { border: { width: 2, color: '#4E342E', style: 'dashed', radius: 0 }, padding: 12, fillColor: '#FFFDE7' },
    typography: {
        title: { fontFamily: 'Luckiest Guy', fontSize: 36, color: '#1B5E20', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 12, color: '#33691E', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Montserrat', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Luckiest Guy', fontSize: 18, color: '#4E342E', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 13, color: '#1B5E20', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 15,
        fillColor: '#2E7D32',
        textStyle: { fontFamily: 'Luckiest Guy', fontSize: 10, color: '#ffffff', lineHeight: 1, alignment: 'center' },
    },
};
