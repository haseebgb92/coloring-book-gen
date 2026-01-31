/**
 * Utility to fetch and convert Google Fonts for jsPDF
 */

interface CachedFont {
    name: string;
    data: string; // base64
}

const fontCache: Record<string, string> = {};

/**
 * Fetches a Google Font and returns base64 data
 * @param fontName The name of the Google Font (e.g., 'Roboto', 'Open Sans')
 * @param weight The font weight (e.g., '400', '700')
 * @returns Base64 string of the TTF file
 */
export async function fetchGoogleFont(fontName: string, weight: string = '400'): Promise<string> {
    const cacheKey = `${fontName}-${weight}`;
    if (fontCache[cacheKey]) return fontCache[cacheKey];

    try {
        const response = await fetch(`/api/font?name=${encodeURIComponent(fontName)}&weight=${weight}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Font server error: ${response.status} ${errorText}`);
        }

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error);
        }

        if (!json.data) {
            throw new Error('No font data received');
        }

        fontCache[cacheKey] = json.data;
        return json.data;
    } catch (error) {
        console.error('Failed to fetch Google Font:', error);
        throw error;
    }
}



/**
 * Common Google Fonts that look good for books
 */
export const POPULAR_FONTS = [
    'Inter',
    'Roboto',
    'Montserrat',
    'Playfair Display',
    'Open Sans',
    'Lora',
    'Merriweather',
    'Poppins',
    'Ubuntu',
    'Quicksand',
    'Pacifico',
    'Indie Flower',
    'Architects Daughter'
];
