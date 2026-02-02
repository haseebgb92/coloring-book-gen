import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

/**
 * Handle Image Uploads to separate KV keys to stay under request size limits
 */
export async function POST(req: Request) {
    try {
        const { image, projectId } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
        }

        // Generate a unique ID for this image
        const imageId = `img_${uuidv4()}`;

        // Store the base64 image separately
        // Note: Upstash KV (Vercel KV) has a 1MB limit by default. 
        // 300 DPI images at 0.8 quality usually fall between 400KB and 800KB.
        await kv.set(imageId, image);

        return NextResponse.json({
            success: true,
            imageId
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Handle Image Retrieval
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const image = await kv.get<string>(id);

        if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

        // If it's a data URL, return it directly or as a proper image response
        if (image.startsWith('data:')) {
            const [meta, base64Data] = image.split(',');
            const contentType = meta.split(':')[1].split(';')[0];
            const buffer = Buffer.from(base64Data, 'base64');

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        return NextResponse.json({ image });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
