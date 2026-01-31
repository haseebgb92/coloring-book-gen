import { Template } from '../types';

export const BUILT_IN_TEMPLATES: Template[] = [
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        fontFamily: 'Helvetica',
        fontSize: 12,
        hasBorder: false,
        imageFit: 'contain',
        pageNumbers: true,
        headingSize: 'M',
    },
    {
        id: 'bedtime-cozy',
        name: 'Bedtime Cozy',
        fontFamily: 'Times',
        fontSize: 11,
        hasBorder: true,
        imageFit: 'contain',
        pageNumbers: true,
        headingSize: 'L',
    },
    {
        id: 'jungle-adventure',
        name: 'Jungle Adventure',
        fontFamily: 'Courier',
        fontSize: 12,
        hasBorder: true,
        imageFit: 'cover',
        pageNumbers: false,
        headingSize: 'L',
    },
];
