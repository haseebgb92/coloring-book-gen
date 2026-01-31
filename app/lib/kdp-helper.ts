import { KDPConfig, TrimSize } from '../types';

export const INCHES_TO_POINTS = 72;

export const KDP_PRESETS: Record<TrimSize, KDPConfig> = {
    '6x9': {
        trimSize: '6x9',
        hasBleed: true,
        margins: {
            top: 0.5,
            bottom: 0.5,
            outer: 0.5,
            inner: 0.75,
        },
    },
    '8x10': {
        trimSize: '8x10',
        hasBleed: true,
        margins: {
            top: 0.5,
            bottom: 0.5,
            outer: 0.5,
            inner: 0.75,
        },
    },
    '8.5x11': {
        trimSize: '8.5x11',
        hasBleed: true,
        margins: {
            top: 0.5,
            bottom: 0.5,
            outer: 0.5,
            inner: 0.75,
        },
    },
};

export function getPageDimensions(config: KDPConfig): { width: number; height: number } {
    const [w, h] = config.trimSize.split('x').map(Number);
    const bleedOffset = config.hasBleed ? 0.125 : 0;

    return {
        width: w + bleedOffset * 2,
        height: h + bleedOffset * 2,
    };
}
