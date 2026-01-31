import { KDPConfig, TrimSize } from "../types";

export const KDP_PRESETS: Record<TrimSize, KDPConfig> = {
    '6x9': {
        trimSize: '6x9',
        hasBleed: true,
        margins: {
            inner: 0.75,
            outer: 0.5,
            top: 0.5,
            bottom: 0.75,
            safeZone: 0.375
        }
    },
    '8x10': {
        trimSize: '8x10',
        hasBleed: true,
        margins: {
            inner: 0.75,
            outer: 0.5,
            top: 0.5,
            bottom: 0.75,
            safeZone: 0.375
        }
    },
    '8.5x11': {
        trimSize: '8.5x11',
        hasBleed: true,
        margins: {
            inner: 0.875,
            outer: 0.5,
            top: 0.5,
            bottom: 0.75,
            safeZone: 0.375
        }
    }
};

export const getPageDimensions = (trimSize: TrimSize, hasBleed: boolean) => {
    // dimensions in inches
    switch (trimSize) {
        case '6x9':
            return hasBleed ? { width: 6.25, height: 9.25 } : { width: 6, height: 9 };
        case '8x10':
            return hasBleed ? { width: 8.25, height: 10.25 } : { width: 8, height: 10 };
        case '8.5x11':
            return hasBleed ? { width: 8.75, height: 11.25 } : { width: 8.5, height: 11 };
    }
};

export const INCHES_TO_POINTS = 72;
