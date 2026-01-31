import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fontName = searchParams.get('name');
    const weight = searchParams.get('weight') || '400';

    if (!fontName) {
        return NextResponse.json({ error: 'Font name is required' }, { status: 400 });
    }

    try {
        // 1. Fetch CSS from Google Fonts with specific User-Agent to ensure TTF format.
        // We use a legacy User-Agent to prompt Google to serve TTF fonts instead of WOFF/WOFF2.
        const cssResponse = await fetch(`https://fonts.googleapis.com/css?family=${fontName.replace(/ /g, '+')}:${weight}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us) AppleWebKit/531.21.11 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10'
            }
        });

        if (!cssResponse.ok) {
            // If the font doesn't exist or other error
            const text = await cssResponse.text();
            console.error(`Google Fonts API Error: ${cssResponse.status}`, text);
            return NextResponse.json({ error: `Google Fonts lookup failed` }, { status: 404 });
        }

        const cssText = await cssResponse.text();

        // 2. Extract TTF URL specifically
        // Look for url(...) ending in .ttf
        let fontUrl = '';
        const urlMatch = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+\.ttf)\)/);

        if (urlMatch) {
            fontUrl = urlMatch[1];
        } else {
            // Fallback: try to find any valid URL (some fonts might not have .ttf extension visible or different path)
            const anyUrlMatch = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+)\)/);
            if (anyUrlMatch) {
                fontUrl = anyUrlMatch[1].replace(/['"]/g, '').split(')')[0];
            } else {
                console.error('Could not extract font URL from CSS:', cssText);
                return NextResponse.json({ error: 'Could not find font source URL' }, { status: 404 });
            }
        }

        // 3. Fetch the actual font file
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) {
            throw new Error(`Failed to download font file: ${fontResponse.statusText}`);
        }

        // 4. Convert to Base64
        const fontBuffer = await fontResponse.arrayBuffer();
        const base64 = Buffer.from(fontBuffer).toString('base64');

        return NextResponse.json({ data: base64 });

    } catch (error) {
        console.error('Font fetch API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
