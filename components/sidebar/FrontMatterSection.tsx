'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store';
import { PageContent } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';

export function FrontMatterSection() {
    const pages = useProjectStore(s => s.frontMatter);
    const updatePages = useProjectStore(s => s.updateFrontMatter);

    const addPage = () => {
        const newPage: PageContent = {
            id: uuidv4(),
            type: 'custom',
            title: 'New Page',
            text: '',
            image: null,
            imagePlacement: 'center',
            includeInToc: true
        };
        updatePages([...pages, newPage]);
    };

    const removePage = (id: string) => {
        updatePages(pages.filter(p => p.id !== id));
    };

    const updatePage = (id: string, updates: Partial<PageContent>) => {
        updatePages(pages.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-gray-500">Add intro pages like Title Page, Copyright, or Dedication.</p>

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
                            <label className="block text-[10px] font-bold text-gray-400">TYPE / TITLE</label>
                            <div className="flex gap-2">
                                <select
                                    value={page.type}
                                    onChange={(e) => updatePage(page.id, { type: e.target.value as any })}
                                    className="text-xs border rounded p-1"
                                >
                                    <option value="title">Title Page</option>
                                    <option value="copyright">Copyright</option>
                                    <option value="dedication">Dedication</option>
                                    <option value="about">About</option>
                                    <option value="toc">Table of Contents</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <input
                                    type="text"
                                    value={page.title}
                                    onChange={(e) => updatePage(page.id, { title: e.target.value })}
                                    className="text-xs border rounded p-1 flex-1"
                                    placeholder="Page Title"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400">CONTENT</label>
                            <textarea
                                className="w-full text-xs border rounded p-1"
                                rows={3}
                                value={page.text}
                                onChange={(e) => updatePage(page.id, { text: e.target.value })}
                                placeholder="Enter page text..."
                            />
                        </div>

                        {/* Image Upload for Front Matter */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1">IMAGE (OPTIONAL)</label>
                            <div className="flex items-center gap-2">
                                {page.image ? (
                                    <div className="relative w-10 h-10 border rounded bg-gray-100">
                                        <img src={page.image} className="w-full h-full object-cover" />
                                        <button onClick={() => updatePage(page.id, { image: null })} className="absolute -top-1 -right-1 bg-red-500 text-white w-3 h-3 flex items-center justify-center rounded-full text-[8px]">×</button>
                                    </div>
                                ) : (
                                    <ImageIcon className="w-4 h-4 text-gray-300" />
                                )}
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            const r = new FileReader();
                                            r.onload = (ev) => ev.target?.result && updatePage(page.id, { image: ev.target.result as string });
                                            r.readAsDataURL(f);
                                        }
                                    }}
                                    className="text-[10px]"
                                />
                            </div>
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
