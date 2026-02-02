import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageSrc(src: string | null): string {
    if (!src) return '';
    if (src.startsWith('cloud:')) {
        const imageId = src.replace('cloud:', '');
        return `/api/image?id=${imageId}`;
    }
    return src;
}
