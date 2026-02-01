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

    // Heading Font 1 (Fredoka Bold)
    Font.register({
        family: 'Fredoka',
        src: 'https://fonts.gstatic.com/s/fredoka/v17/X7nP4b87HvSqjb_WIi2yDCRwoQ_k7367_B-i2yQag0-mac3OFiXMFg.ttf'
    });

    // Heading Font 2 (Outfit Bold)
    Font.register({
        family: 'Outfit',
        src: 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf'
    });
};
