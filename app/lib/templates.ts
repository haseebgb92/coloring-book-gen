import { Template } from "../types";

export const BUILT_IN_TEMPLATES: Template[] = [
    {
        id: 'minimal',
        name: 'Minimal Clean',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'M',
        bodySize: 'M',
        hasBorder: true,
        pageNumbers: true,
        imageFit: 'contain'
    },
    {
        id: 'bedtime',
        name: 'Bedtime Cozy',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'L',
        bodySize: 'M',
        hasBorder: true,
        pageNumbers: true,
        imageFit: 'cover'
    },
    {
        id: 'jungle',
        name: 'Jungle Adventure',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'M',
        bodySize: 'S',
        hasBorder: true,
        pageNumbers: true,
        imageFit: 'cover'
    },
    {
        id: 'ocean',
        name: 'Ocean Friends',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'L',
        bodySize: 'M',
        hasBorder: true,
        pageNumbers: false,
        imageFit: 'contain'
    },
    {
        id: 'fairytale',
        name: 'Fairy Tale',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'L',
        bodySize: 'L',
        hasBorder: true,
        pageNumbers: true,
        imageFit: 'cover'
    },
    {
        id: 'neutral',
        name: 'Neutral / Calm',
        fontFamily: "'Outfit', sans-serif",
        headingSize: 'M',
        bodySize: 'M',
        hasBorder: false,
        pageNumbers: true,
        imageFit: 'contain'
    }
];
