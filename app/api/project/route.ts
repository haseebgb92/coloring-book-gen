import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

/**
 * API to Save Project JSON to Vercel KV
 */
export async function POST(req: Request) {
    try {
        const project = await req.json();

        if (!project.id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        // Check if KV is configured (to prevent crash if user hasn't linked DB yet)
        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({
                error: 'Vercel KV not configured. Please link a KV database in your Vercel project settings.'
            }, { status: 500 });
        }

        await kv.set(`project:${project.id}`, project);

        return NextResponse.json({
            success: true,
            id: project.id,
            url: `${new URL(req.url).origin}/?project=${project.id}`
        });

    } catch (error: any) {
        console.error('Save Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * API to Load Project JSON from Vercel KV
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({ error: 'Vercel KV not configured' }, { status: 500 });
        }

        const project = await kv.get(`project:${id}`);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);

    } catch (error: any) {
        console.error('Load Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
