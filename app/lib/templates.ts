import { Template } from '../types';

export const BUILT_IN_TEMPLATES: Template[] = [
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple and legible, great for early readers',
        fontFamily: 'Helvetica',
        fontSize: 14,
        hasBorder: false,
        borderColor: '#000000',
        layoutStyle: 'modern'
    },
    {
        id: 'playful-comic',
        name: 'Playful Comic',
        description: 'Fun comic-style look',
        fontFamily: 'Comic Neue',
        fontSize: 16,
        hasBorder: true,
        borderColor: '#000000',
        layoutStyle: 'comic'
    },
    {
        id: 'handwritten-story',
        name: 'Handwritten Story',
        description: 'Feels like a personal letter',
        fontFamily: 'Patrick Hand',
        fontSize: 18,
        hasBorder: false,
        borderColor: '#333333',
        layoutStyle: 'classic'
    },
    {
        id: 'bubbly-fun',
        name: 'Bubbly Fun',
        description: 'Rounded and friendly',
        fontFamily: 'Sniglet',
        fontSize: 15,
        hasBorder: true,
        borderColor: '#444444',
        layoutStyle: 'modern'
    },
    {
        id: 'whimsical-tale',
        name: 'Whimsical Tale',
        description: 'Artistic and flowing',
        fontFamily: 'Indie Flower',
        fontSize: 16,
        hasBorder: false,
        borderColor: '#000000',
        layoutStyle: 'classic'
    },
    {
        id: 'bold-learning',
        name: 'Bold Learning',
        description: 'Clear and emphatic for easy reading',
        fontFamily: 'Fredoka',
        fontSize: 15,
        hasBorder: true,
        borderColor: '#000000',
        layoutStyle: 'comic'
    }
];
