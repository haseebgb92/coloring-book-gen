import { Font } from '@react-pdf/renderer';

/**
 * Isolated Font Registration
 * Using direct fonts.gstatic.com URLs for maximum stability.
 * These are the same URLs used by Google Fonts in the browser.
 */
export const registerFonts = () => {
    // Tracing Font (Codystar Regular)
    Font.register({
        family: 'Codystar',
        src: 'https://fonts.gstatic.com/s/codystar/v19/FwZY7-Q1xVk-40qxOt6A.ttf'
    });

    // Heading Fonts
    Font.register({
        family: 'Fredoka',
        src: 'https://fonts.gstatic.com/s/fredoka/v17/X7nP4b87HvSqjb_WIi2yDCRwoQ_k7367_B-i2yQag0-mac3OFiXMFg.ttf'
    });

    Font.register({
        family: 'Outfit',
        src: 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf'
    });

    Font.register({
        family: 'Bubblegum Sans',
        src: 'https://fonts.gstatic.com/s/bubblegumsans/v22/AYCSpXb_Z9EORv1M5QTjEzMEtdaH.ttf'
    });

    Font.register({
        family: 'Indie Flower',
        src: 'https://fonts.gstatic.com/s/indieflower/v24/m8JVjfNVeKWVnh3QMuKkFcZlbg.ttf'
    });

    Font.register({
        family: 'Orbitron',
        src: 'https://fonts.gstatic.com/s/orbitron/v35/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1ny_Cmxpg.ttf'
    });

    Font.register({
        family: 'Comfortaa',
        src: 'https://fonts.gstatic.com/s/comfortaa/v47/1Pt_g8LJRfWJmhDAuUsSQamb1W0lwk4S4Y_LPrQ.ttf'
    });

    Font.register({
        family: 'Architects Daughter',
        src: 'https://fonts.gstatic.com/s/architectsdaughter/v20/KtkxAKiDZI_td1Lkx62xHZHDtgO_Y-bvfY4.ttf'
    });
};

export const REGISTERED_FONTS = [
    'Fredoka',
    'Outfit',
    'Bubblegum Sans',
    'Indie Flower',
    'Orbitron',
    'Comfortaa',
    'Architects Daughter'
];
