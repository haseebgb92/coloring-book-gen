import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API to Save Project JSON to Vercel KV with History and Indexing
 */
export async function POST(req: Request) {
    try {
        const project = await req.json();

        if (!project.id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({
                error: 'Vercel KV not configured.'
            }, { status: 500 });
        }

        // 1. Update the "latest" version
        await kv.set(`project:${project.id}`, project);

        // 2. Manage history/versions list (last 3)
        const historyKey = `history:${project.id}`;
        await kv.lpush(historyKey, JSON.stringify(project));
        await kv.ltrim(historyKey, 0, 2);

        // 3. Maintain Global Index for Gallery
        // We store metadata: { id, name, lastModified, sceneCount, thumbnailData? }
        const metadata = {
            id: project.id,
            name: project.name || 'Untitled Book',
            lastModified: project.lastModified || Date.now(),
            sceneCount: project.scenes?.length || 0,
            templateId: project.template?.id,
            colors: project.template?.colors
        };

        // Use a HASH to store project metadata for quick listing
        // field: projectId, value: stringified metadata
        await kv.hset('projects:metadata', { [project.id]: JSON.stringify(metadata) });
        // Double-check indexing using explicit field/value if the above form has issues in some environments
        // await kv.hset('projects:metadata', project.id, JSON.stringify(metadata));

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
 * API to Load Project JSON or List Projects
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const listAll = searchParams.get('list');
        const version = searchParams.get('version');
        const listHistory = searchParams.get('listHistory');

        if (!process.env.KV_REST_API_URL) {
            return NextResponse.json({ error: 'Vercel KV not configured' }, { status: 500 });
        }

        // Action: List all projects for Gallery
        if (listAll) {
            const allMetadata = await kv.hgetall('projects:metadata');
            if (!allMetadata) return NextResponse.json([]);

            // Convert hash map to sorted array (newest first)
            const list = Object.values(allMetadata)
                .map(v => typeof v === 'string' ? JSON.parse(v) : v)
                .sort((a, b) => b.lastModified - a.lastModified);

            return NextResponse.json(list);
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }

        // Action: List history versions (just metadata)
        if (listHistory) {
            const history = await kv.lrange(`history:${id}`, 0, 2);
            const simplifiedHistory = history.map((item, idx) => {
                const p = typeof item === 'string' ? JSON.parse(item) : item;
                return {
                    version: idx,
                    lastModified: p.lastModified,
                    sceneCount: p.scenes?.length || 0
                };
            });
            return NextResponse.json(simplifiedHistory);
        }

        // Action: Load specific project (or version)
        let project;
        if (version !== null && version !== undefined && version !== '') {
            const index = parseInt(version);
            const item = await kv.lindex(`history:${id}`, index);
            project = typeof item === 'string' ? JSON.parse(item) : item;
        } else {
            project = await kv.get(`project:${id}`);
        }

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * API to Delete Project
 */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await kv.del(`project:${id}`);
        await kv.del(`history:${id}`);
        await kv.hdel('projects:metadata', id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
