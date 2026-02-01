'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { PageContent } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function EndingPagesSection() {
    const pages = useProjectStore(s => s.endingPages);
    const updatePages = useProjectStore(s => s.updateEndingPages);

    const addPage = () => {
        const newPage: PageContent = {
            id: uuidv4(),
            type: 'custom',
            title: 'The End',
            text: 'Thanks for reading!',
            image: null,
            imagePlacement: 'center',
            includeInToc: false
        };
        updatePages([...pages, newPage]);
    };

    const removePage = (id: string) => updatePages(pages.filter(p => p.id !== id));
    const updatePage = (id: string, updates: Partial<PageContent>) => updatePages(pages.map(p => p.id === id ? { ...p, ...updates } : p));

    return (
        <div className="space-y-4">
            <p className="text-xs text-gray-500">Add ending pages like "The End", "About Author", or "Notes".</p>
            {pages.map((page, idx) => (
                <div key={page.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                    <div className="bg-gray-50 p-2 border-b flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-600 flex items-center gap-2">
                            <GripVertical className="w-3 h-3 text-gray-400" />
                            Page {idx + 1}
                        </span>
                        <button onClick={() => removePage(page.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="p-3 space-y-3">
                        <div>
                            <input
                                type="text"
                                value={page.title}
                                onChange={(e) => updatePage(page.id, { title: e.target.value })}
                                className="w-full text-xs border rounded p-1 font-bold"
                                placeholder="Page Title"
                            />
                        </div>
                        <div>
                            <textarea
                                className="w-full text-xs border rounded p-1"
                                rows={3}
                                value={page.text}
                                onChange={(e) => updatePage(page.id, { text: e.target.value })}
                                placeholder="Enter text..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addPage}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
                <Plus className="w-4 h-4" /> Add Page
            </button>
        </div>
    );
}
