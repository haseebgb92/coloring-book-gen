import type { Template } from '../types';

export const ticketStubTemplate: Template = {
    id: 'ticket-stub-premium',
    name: '20 — Ticket Stub Grid',
    description: 'Playful perforated ticket boundary',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1.5, color: '#222222', style: 'dotted', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.8, color: '#222222', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0.8, color: '#222222', style: 'dashed', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Anton', fontSize: 26, color: '#000000', lineHeight: 1, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Cutive Mono', fontSize: 13, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Anton', fontSize: 18, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 11, color: '#111111', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'top-outer',
        style: 'modern-box',
        margin: 10,
        textStyle: { fontFamily: 'Anton', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
