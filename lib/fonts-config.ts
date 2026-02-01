import { Font } from '@react-pdf/renderer';

/**
 * Isolated Font Registration
 * Using direct raw.githubusercontent.com URLs to avoid JSDelivr traversal limits (403 errors).
 */
export const registerFonts = () => {
    // Tracing Font
    Font.register({
        family: 'Codystar',
        src: 'https://raw.githubusercontent.com/google/fonts/main/ofl/codystar/Codystar-Regular.ttf'
    });

    // Heading Font 1
    Font.register({
        family: 'Fredoka',
        src: 'https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/static/Fredoka-Bold.ttf'
    });

    // Heading Font 2
    Font.register({
        family: 'Outfit',
        src: 'https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/static/Outfit-Bold.ttf'
    });

    // Standard Fallbacks are usually provided by the browser/system 
    // but react-pdf requires absolute URLs for custom fonts.
};
