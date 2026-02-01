import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

/**
 * API to Save Project JSON to Vercel KV with History
 */
export async function POST(req: Request) {
    try {
        const project = await req.json();

        if (!project.id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({
                error: 'Vercel KV not configured. Please link a KV database.'
            }, { status: 500 });
        }

        // 1. Update the "latest" version
        await kv.set(`project:${project.id}`, project);

        // 2. Manage history/versions list
        // We use a Redis LIST to store the last 3 versions of the project JSON
        const historyKey = `history:${project.id}`;

        // Push the stringified project to the front of the list
        await kv.lpush(historyKey, project);

        // Keep only the most recent 3 entries
        await kv.ltrim(historyKey, 0, 2);

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
        const version = searchParams.get('version'); // Optional: index 0, 1, or 2

        if (!id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({ error: 'Vercel KV not configured' }, { status: 500 });
        }

        let project;
        if (version !== null) {
            // Load a specific version from history (0 is latest, 2 is oldest)
            const index = parseInt(version);
            project = await kv.lindex(`history:${id}`, index);
        } else {
            // Load the main "live" version
            project = await kv.get(`project:${id}`);
        }

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);

    } catch (error: any) {
        console.error('Load Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
